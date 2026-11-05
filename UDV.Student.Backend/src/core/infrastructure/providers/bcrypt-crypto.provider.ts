import * as bcrypt from "bcrypt";
import { createHash } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ICryptoProvider } from "../../domain/providers/crypto.provider";
import { IGlobalConfiguration } from "../../../shared/configuration/global.configuration";

@Injectable()
export class BcryptCryptoProvider implements ICryptoProvider {
    private readonly _salt: number;

    constructor(private readonly _configService: ConfigService) {
        const { SALT } = this._configService.getOrThrow<IGlobalConfiguration>("GLOBAL");
        this._salt = SALT;
    }

    public cipher(input: string): Promise<string> {
        return bcrypt.hash(input, this._salt);
    }

    public compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }

    // sha256 for long opaque tokens (e.g. refresh tokens). Deterministic and
    // without bcrypt's 72-byte input limit.
    public hash(value: string): string {
        return createHash("sha256").update(value).digest("hex");
    }
}
