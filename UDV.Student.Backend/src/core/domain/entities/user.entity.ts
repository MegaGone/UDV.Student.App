import { UserExceptionCode } from "../enums/exception.enum";
import { InvalidValueException } from "../exceptions/invalid-value.exception";

export type FieldsOfUserEntity = {
    readonly email: string;
    readonly username: string;
    readonly id?: string | null;
    readonly isActive?: boolean;
    readonly passwordHash: string;
}

const USERNAME_MIN_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEntity {
    private _id: string;
    private _email: string;
    private _username: string;
    private _isActive: boolean;
    private _passwordHash: string;

    constructor(readonly _props: FieldsOfUserEntity) {
        this.assertValidEmail(_props.email);
        this.assertValidUsername(_props.username);

        this._id = _props.id;
        this._username = _props.username.trim();
        this._passwordHash = _props.passwordHash;
        this._isActive = _props.isActive ?? true;
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
}
