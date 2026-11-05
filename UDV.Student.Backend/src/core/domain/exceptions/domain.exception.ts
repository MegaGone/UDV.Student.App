import { EnumLike, EnumValue } from "../enums/enum.type";
import { ExceptionType } from "../enums/exception-type.enum";

export abstract class DomainException<C extends EnumLike> extends Error {
    constructor(
        message: string,
        public readonly type: ExceptionType,
        public readonly code: EnumValue<C>,
    ) {
        super(message || code);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
