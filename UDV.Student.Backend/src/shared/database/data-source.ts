import { DataSource } from "typeorm";
import { UserSchema } from "../../core/infrastructure/schemas/user.schema";

/**
 * Standalone DataSource used only by the TypeORM CLI (migration generate/run/revert).
 * The running app configures TypeORM through NestJS (database.configuration.ts).
 */
export default new DataSource({
    type: "better-sqlite3",
    database: process.env.SQL_DATABASE || "udvstudentapp.sqlite",
    entities: [UserSchema],
    migrations: ["src/shared/database/migrations/*.ts"],
    synchronize: false,
});
