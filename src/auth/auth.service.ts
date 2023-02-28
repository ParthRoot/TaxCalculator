import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { AuthUserDto } from "src/dto/Request/authUserDto";

import * as bcrypt from "bcrypt";
import { DataSource, Repository } from "typeorm";
import { authUser } from "src/db/entities/auth.entity";

@Injectable()
export class AuthService {
  private AdminRepo: Repository<authUser>;
  constructor(
    @Inject("DataSource")
    private dataSource: DataSource
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
      console.log("success");
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("user name already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
