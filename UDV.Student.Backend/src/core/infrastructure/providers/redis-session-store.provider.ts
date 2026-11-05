import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.provider";
import { Inject, Injectable } from "@nestjs/common";
import { ISessionStore } from "../../domain/providers/session-store.provider";

@Injectable()
export class RedisSessionStore implements ISessionStore {
    constructor(@Inject(REDIS_CLIENT) private readonly _redis: Redis) { }

    private sessionKey(userId: string, jti: string): string {
        return `session:${userId}:${jti}`;
    }

    private userSetKey(userId: string): string {
        return `user:${userId}:sessions`;
    }

    public async save(userId: string, jti: string, tokenHash: string, ttlSeconds: number): Promise<void> {
        await this._redis
            .multi()
            .set(this.sessionKey(userId, jti), tokenHash, "EX", ttlSeconds)
            .sadd(this.userSetKey(userId), jti)
            .exec();
    }

    public find(userId: string, jti: string): Promise<string | null> {
        return this._redis.get(this.sessionKey(userId, jti));
    }

    public async revoke(userId: string, jti: string): Promise<void> {
        await this._redis
            .multi()
            .del(this.sessionKey(userId, jti))
            .srem(this.userSetKey(userId), jti)
            .exec();
    }

    public async revokeAll(userId: string): Promise<void> {
        const jtis = await this._redis.smembers(this.userSetKey(userId));

        const pipeline = this._redis.multi();
        for (const jti of jtis) pipeline.del(this.sessionKey(userId, jti));
        pipeline.del(this.userSetKey(userId));

        await pipeline.exec();
    }

    public async listByUser(userId: string): Promise<string[]> {
        const jtis = await this._redis.smembers(this.userSetKey(userId));
        if (jtis.length === 0) return [];

        // Session keys expire on their own, but their jti lingers in the set.
        // Check which ones are still alive and prune the stale entries.
        const pipeline = this._redis.pipeline();
        jtis.forEach((jti) => pipeline.exists(this.sessionKey(userId, jti)));
        const results = await pipeline.exec();

        const active: string[] = [];
        const stale: string[] = [];

        jtis.forEach((jti, index) => {
            const isAlive = results?.[index]?.[1] === 1;
            (isAlive ? active : stale).push(jti);
        });

        if (stale.length > 0) await this._redis.srem(this.userSetKey(userId), ...stale);

        return active;
    }
}
