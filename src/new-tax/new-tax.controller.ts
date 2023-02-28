import { Body, Controller, Get, ParseIntPipe } from "@nestjs/common";
import { NewTaxInputDto, OldTaxInputDto } from "src/dto/Request/taxInputDto";
import { NewTaxService } from "./new-tax.service";

@Controller("new-tax")
export class NewTaxController {
  constructor(private newTaxService: NewTaxService) {}

  @Get("new")
  taxCal(@Body() newtaxInputDto: NewTaxInputDto): any {
    return this.newTaxService.taxCal(newtaxInputDto);
  }

  @Get("old")
  oldTaxCal(@Body() oldtaxInputDto: OldTaxInputDto): number  {
    return this.newTaxService.oldTaxCal(oldtaxInputDto);
  }
}
