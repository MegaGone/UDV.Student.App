import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitUsers1731110000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    { name: "id", type: "varchar", isPrimary: true },
                    { name: "email", type: "varchar", isUnique: true },
                    { name: "username", type: "varchar", isUnique: true },
                    { name: "passwordHash", type: "varchar" },
                    { name: "isActive", type: "boolean", default: 1 },
                    { name: "avatar", type: "varchar", isNullable: true },
                    { name: "role", type: "varchar", default: "'USER'" },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}
