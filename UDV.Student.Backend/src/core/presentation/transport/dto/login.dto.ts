import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: "catedratico@udv.edu.gt", description: "Registered user email." })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "Seed.Udv2026", description: "User password." })
    @IsString()
    @IsNotEmpty()
    password: string;
}
