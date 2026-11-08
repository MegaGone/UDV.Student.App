import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ConfirmAvatarDto {
    @ApiProperty({ description: "The object key returned by the upload-url endpoint, once the file was uploaded to storage." })
    @IsString()
    @IsNotEmpty()
    objectKey: string;
}
