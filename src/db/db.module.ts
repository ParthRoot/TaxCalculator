import { Module } from "@nestjs/common";
import { Global } from "@nestjs/common/decorators";
import { dataSource } from "./db.config";
import { DbController } from "./db.controller";
import { DbService } from "./db.service";
import { newtax } from "./entities/newTax.tbl.entity";

@Global()
@Module({
  controllers: [DbController],
  providers: [DbService, ...dataSource],
  exports: [...dataSource],
})
export class DbModule {}
