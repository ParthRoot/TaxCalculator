import { Module } from "@nestjs/common";
import { NewTaxController } from "./new-tax.controller";
import { NewTaxService } from "./new-tax.service";

@Module({
  controllers: [NewTaxController],
  providers: [NewTaxService],
  exports: [NewTaxService],
})
export class NewTaxModule {}
