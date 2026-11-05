import { Injectable } from "@nestjs/common";
import { ISessionStore } from "src/core/domain/providers/session-store.provider";

@Injectable()
export class LogoutUseCase {
    constructor(private readonly _sessionStore: ISessionStore) { }

    public execute(userId: string): Promise<void> {
        return this._sessionStore.revokeAll(userId);
    }
}
