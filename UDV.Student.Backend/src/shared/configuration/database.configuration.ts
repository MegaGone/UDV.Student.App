import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { UserSchema } from "../../core/infrastructure/schemas/user.schema";

export default registerAs("DATABASE", (): TypeOrmModuleOptions => ({
    dropSchema: false,
    type: "better-sqlite3",
    autoLoadEntities: false,
    entities: [UserSchema],
    logging: process.env.SQL_LOGGING === "1",
    synchronize: process.env.SQL_SYNCHRONIZE === "1",
    database: process.env.SQL_DATABASE || "udvstudentapp.sqlite",
}));
