import { UserRole } from "../enums/user-role.enum";
import { UserExceptionCode } from "../enums/exception.enum";
import { InvalidValueException } from "../exceptions/invalid-value.exception";

export type FieldsOfUserEntity = {
    readonly email: string;
    readonly role?: UserRole;
    readonly username: string;
    readonly id?: string | null;
    readonly isActive?: boolean;
    readonly passwordHash: string;
    readonly avatar?: string | null;
}

const USERNAME_MIN_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEntity {
    private _id: string;
    private _email: string;
    private _role: UserRole;
    private _username: string;
    private _isActive: boolean;
    private _passwordHash: string;
    private _avatar: string | null;

    constructor(readonly _props: FieldsOfUserEntity) {
        this.assertValidEmail(_props.email);
        this.assertValidUsername(_props.username);

        this._id = _props.id;
        this._avatar = _props.avatar ?? null;
        this._username = _props.username.trim();
        this._passwordHash = _props.passwordHash;
        this._isActive = _props.isActive ?? true;
        this._role = _props.role ?? UserRole.USER;
        this._email = _props.email.trim().toLowerCase();
    }

    private assertValidEmail(email: string): void {
        if (!email || !EMAIL_REGEX.test(email.trim()))
            throw new InvalidValueException(
                UserExceptionCode.INVALID_EMAIL,
                "Invalid email format",
            );
    }

    private assertValidUsername(username: string): void {
        if (!username || username.trim().length < USERNAME_MIN_LENGTH)
            throw new InvalidValueException(
                UserExceptionCode.INVALID_USERNAME,
                `Username must be at least ${USERNAME_MIN_LENGTH} characters long`,
            );
    }

    public get id(): string {
        return this._id;
    }

    public get email(): string {
        return this._email;
    }

    public get username(): string {
        return this._username;
    }

    public get passwordHash(): string {
        return this._passwordHash;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public get avatar(): string | null {
        return this._avatar;
    }

    public get role(): UserRole {
        return this._role;
    }

    public changeAvatar(avatar: string): void {
        this._avatar = avatar;
    }
}
