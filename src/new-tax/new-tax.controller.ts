import { Body, Controller, Get, ParseIntPipe } from "@nestjs/common";
import { Post, Req, Res, UseInterceptors } from "@nestjs/common/decorators";
import { CustomSlabDTO } from "src/dto/Request/slabDto";
import { NewTaxInputDto, OldTaxInputDto } from "src/dto/Request/taxInputDto";
// import { AppInterceptor } from "src/middleware/log.middleware";
import { NewTaxService } from "./new-tax.service";

@Controller("new-tax")
export class NewTaxController {
  constructor(private newTaxService: NewTaxService) {}

  // @UseInterceptors(AppInterceptor)
  @Post("new")
  taxCal(@Req() req, @Body() newtaxInputDto: NewTaxInputDto): any {
    const myData1 = req.headers;

    return this.newTaxService.taxCal(newtaxInputDto, myData1);
  }

  @Post("old")
  oldTaxCal(
    @Req() req,
    @Body() oldtaxInputDto: OldTaxInputDto
  ): Promise<number> {
    const myData1 = req.headers;
    return this.newTaxService.oldTaxCal(oldtaxInputDto, myData1);
  }

  @Post("createSlab")
  createSlab(@Body() customSlabDTO: CustomSlabDTO) {
    return this.newTaxService.createSlab(customSlabDTO);
  }
}
