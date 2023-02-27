import { Controller, Get } from "@nestjs/common";
import { NewTaxService } from "./new-tax.service";

@Controller("new-tax")
export class NewTaxController {
  constructor(private newTaxService: NewTaxService) {}

  @Get()
  sayHello(): string {
    return this.newTaxService.taxCal();
  }
}
