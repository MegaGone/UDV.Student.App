import { EntitySchema } from "typeorm";
import { UserModel } from "../models/user.model";

export const UserSchema = new EntitySchema<UserModel>({
    name: "User",
    tableName: "users",
    columns: {
        id: { type: String, primary: true, generated: "uuid" },
        email: { type: String, unique: true },
        username: { type: String, unique: true },
        passwordHash: { type: String },
        isActive: { type: Boolean, default: true },
        avatar: { type: String, nullable: true },
    }
});
