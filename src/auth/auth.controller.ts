import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthUserDto } from "src/dto/Request/authUserDto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signUp(@Body() authUserDto: AuthUserDto) {
    return this.authService.signUp(authUserDto);
  }

  @Get("login")
  signIn(@Body() authUserDto: AuthUserDto) {
    return this.authService.signIn(authUserDto);
  }
}
