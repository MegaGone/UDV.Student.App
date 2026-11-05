export type EnumLike = { [k: string]: string };
export type EnumValue<E extends EnumLike> = E[keyof E];
