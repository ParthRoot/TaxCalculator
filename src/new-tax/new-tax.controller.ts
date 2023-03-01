import { Body, Controller, Get, ParseIntPipe } from "@nestjs/common";
import {
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { NewTaxInputDto, OldTaxInputDto } from "src/dto/Request/taxInputDto";
// import { AppInterceptor } from "src/middleware/log.middleware";
import { NewTaxService } from "./new-tax.service";

@Controller("new-tax")
export class NewTaxController {
  constructor(private newTaxService: NewTaxService) {}

  // @UseInterceptors(AppInterceptor)

  @Get("new")
  @UseGuards(AuthGuard("jwt"))
  taxCal(@Req() req, @Body() newtaxInputDto: NewTaxInputDto): any {
    const myData1 = req.headers;

    return this.newTaxService.taxCal(newtaxInputDto, myData1);
  }

  @Get("old")
  oldTaxCal(@Req() req, @Body() oldtaxInputDto: OldTaxInputDto): number {
    const myData1 = req.headers;
    return this.newTaxService.oldTaxCal(oldtaxInputDto, myData1);
  }
}
