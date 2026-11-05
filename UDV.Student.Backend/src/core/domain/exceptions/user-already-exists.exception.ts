import { DomainException } from "./domain.exception";
import { EnumLike, EnumValue } from "../enums/enum.type";
import { ExceptionType } from "../enums/exception-type.enum";

export class UserAlreadyExistsException<C extends EnumLike> extends DomainException<C> {
    constructor(code: EnumValue<C>, message?: string) {
        super(message, ExceptionType.CONFLICT, code);
    }
}
