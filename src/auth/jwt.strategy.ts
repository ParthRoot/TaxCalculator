import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authUser } from "src/db/entities/auth.entity";
import { DataSource, Repository } from "typeorm";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "key",
    });
  }
  async validate(payload: JwtPayload): Promise<any> {
    const { email } = payload;
    const user = await this.AdminRepo.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
