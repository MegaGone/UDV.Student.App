export abstract class ICryptoProvider {
    public abstract hash(value: string): string
    public abstract cipher(input: string): Promise<string>
    public abstract compare(plain: string, hash: string): Promise<boolean>
}