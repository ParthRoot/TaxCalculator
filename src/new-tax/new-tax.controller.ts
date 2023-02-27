import { Body, Controller, Get, ParseIntPipe } from "@nestjs/common";
import { TaxInputDto } from "src/dto/Request/taxInputDto";
import { NewTaxService } from "./new-tax.service";

@Controller("new-tax")
export class NewTaxController {
  constructor(private newTaxService: NewTaxService) {}

  @Get()
  taxCal(@Body() taxInputDto: TaxInputDto): any {
    return this.newTaxService.taxCal(taxInputDto);
  }
}
