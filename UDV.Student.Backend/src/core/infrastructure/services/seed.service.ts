import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { StoreUserUseCase } from "../../application/use-cases";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { IGlobalConfiguration } from "../../../shared/configuration/global.configuration";

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    private readonly _logger = new Logger(SeedService.name);

    constructor(
        private readonly _dataSource: DataSource,
        private readonly _configService: ConfigService,
        private readonly _storeUserUseCase: StoreUserUseCase,
    ) { }

    public async onApplicationBootstrap(): Promise<void> {
        const { RESET_ALL_ON_STARTUP, SEED_PASSWORD } =
            this._configService.getOrThrow<IGlobalConfiguration>("GLOBAL");

        if (!RESET_ALL_ON_STARTUP) return;

        this._logger.debug("[INFO][SEED] Seeding users.");
        await this._dataSource.synchronize(true);

        await this.seedUsers(SEED_PASSWORD);
    }

    private async seedUsers(password: string): Promise<void> {
        const users = [
            { email: "catedratico@udv.edu.gt", username: "catedratico" },
            { email: "estudiante@udv.edu.gt", username: "estudiante" },
        ];

        for (const user of users) {
            await this._storeUserUseCase.execute({ ...user, password });
            this._logger.log(`Seeded user: ${user.email}`);
        }
    }
}
