import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: "catedratico@udv.edu.gt", description: "Email for the new account." })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "catedratico", description: "Public username (min 8 characters)." })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    username: string;

    @ApiProperty({ example: "Seed.Udv2026", description: "Account password." })
    @IsString()
    @IsNotEmpty()
    password: string;
}
