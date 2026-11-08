import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class UploadAvatarDto {
    @ApiProperty({ example: "profile.jpg", description: "Original file name; its extension is kept in the object key." })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty({ example: "image/jpeg", description: "MIME type of the file to upload." })
    @IsString()
    @IsNotEmpty()
    contentType: string;
}
