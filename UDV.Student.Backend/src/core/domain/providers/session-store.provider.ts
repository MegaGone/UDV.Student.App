export abstract class ISessionStore {
    public abstract revokeAll(userId: string): Promise<void>;
    public abstract listByUser(userId: string): Promise<string[]>;
    public abstract revoke(userId: string, jti: string): Promise<void>;
    public abstract find(userId: string, jti: string): Promise<string | null>;
    public abstract save(userId: string, jti: string, tokenHash: string, ttlSeconds: number): Promise<void>;
}
