import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthUserDto } from "src/dto/Request/authUserDto";
import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";
import { DataSource, Repository } from "typeorm";
import { authUser } from "src/db/entities/auth.entity";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  private AdminRepo: Repository<authUser>;
  constructor(
    @Inject("DataSource")
    private dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {
    this.AdminRepo = this.dataSource.getRepository(authUser);
  }

  async signUp(authUserDto: AuthUserDto) {
    let { email, password } = authUserDto;

    //hash
    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.AdminRepo.create({
      email,
      password: hashPassword,
    });

    try {
      await this.AdminRepo.save(user);
      return "SignUp Successfully";
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("user name already exists");
      } else {
        throw new InternalServerErrorException("something went wrong");
      }
    }
  }

  async signIn(authUserDto: AuthUserDto): Promise<string> {
    const { email, password } = authUserDto;

    const user = await this.AdminRepo.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };

      const accessToken: string = await this.jwtService.sign(payload);
      return `SignIn Successfully ${accessToken}`;
    } else {
      throw new UnauthorizedException("Please check your login credentials");
    }
  }
}
