import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AuthUserDto } from "src/dto/Request/authUserDto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 201, description: "signUp Successfully" })
  @ApiResponse({ status: 409, description: "user name already exists" })
  @ApiResponse({ status: 500, description: "something went wrong" })
  @Post("signup")
  signUp(@Body() authUserDto: AuthUserDto) {
    return this.authService.signUp(authUserDto);
  }

  @ApiResponse({ status: 200, description: "signIn Successfully access token" })
  @ApiResponse({ status: 500, description: "something went wrong" })
  @Post("login")
  signIn(@Body() authUserDto: AuthUserDto) {
    return this.authService.signIn(authUserDto);
  }
}
