import { Module, NestModule, RequestMethod } from "@nestjs/common";
import { NewTaxModule } from "./new-tax/new-tax.module";
import { DbModule } from "./db/db.module";
import { MiddlewareConsumer } from "@nestjs/common/interfaces/middleware/middleware-consumer.interface";
// import { LogMiddleWare } from "./middleware/log.middleware";
import { NewTaxController } from "./new-tax/new-tax.controller";
import { LoggerMiddleware } from "./middleware/log.middleware";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [NewTaxModule, DbModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(NewTaxController);
  }
}
