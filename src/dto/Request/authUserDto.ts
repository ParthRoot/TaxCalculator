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
  })
  @IsNotEmpty()
  @IsEmail()
  @MinLength(10)
  @MaxLength(50)
  email: string;

  @ApiProperty({ description: "password" })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @Matches(/((?=.*d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;
}
