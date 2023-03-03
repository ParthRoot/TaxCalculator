import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class AuthUserDto {
  @ApiProperty({
    description: "email",
    example: "parthitadara@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  @MinLength(10)
  @MaxLength(50)
  email: string;

  @ApiProperty({ description: "password", example: "Parth@123" })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @Matches(/((?=.*d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;
}
