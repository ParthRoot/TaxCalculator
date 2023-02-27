import { Module } from "@nestjs/common";
import { NewTaxModule } from "./new-tax/new-tax.module";

@Module({
  imports: [NewTaxModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
