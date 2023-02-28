import { Body, Controller, Post } from "@nestjs/common";
import { AuthUserDto } from "src/dto/Request/authUserDto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signUp(@Body() authUserDto: AuthUserDto) {
    return this.authService.signUp(authUserDto);
  }
}
