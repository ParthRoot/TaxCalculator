import { AuthGuard } from "@nestjs/passport";
import { Body, Controller } from "@nestjs/common";
import { Post, Req, UseGuards } from "@nestjs/common/decorators";
import { ApiResponse } from "@nestjs/swagger/dist";
import { CustomSlabDTO } from "src/dto/Request/slabDto";
import { NewTaxInputDto, OldTaxInputDto } from "src/dto/Request/taxInputDto";
// import { AppInterceptor } from "src/middleware/log.middleware";
import { NewTaxService } from "./new-tax.service";

@Controller("new-tax")
export class NewTaxController {
  constructor(private newTaxService: NewTaxService) {}

  // @UseInterceptors(AppInterceptor)
  @ApiResponse({ status: 201, description: "return tax in number" })
  @ApiResponse({ status: 406, description: "range out of bound" })
  @ApiResponse({ status: 404, description: "slab is not found" })
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 500, description: "something went wrong" })
  @Post("new")
  taxCal(@Req() req, @Body() newtaxInputDto: NewTaxInputDto): any {
    const myData1 = req.headers.data;
    const uemail = req.user.email;
    return this.newTaxService.taxCal(newtaxInputDto, myData1, uemail);
  }

  @ApiResponse({ status: 201, description: "return tax in number" })
  @ApiResponse({ status: 406, description: "range out of bound" })
  @ApiResponse({ status: 404, description: "slab is not found" })
  @ApiResponse({ status: 500, description: "something went wrong" })
  @UseGuards(AuthGuard("jwt"))
  @Post("old")
  oldTaxCal(
    @Req() req,
    @Body() oldtaxInputDto: OldTaxInputDto
  ): Promise<number> {
    const myData1 = req.headers.data;
    const uemail = req.user.email;

    return this.newTaxService.oldTaxCal(oldtaxInputDto, myData1, uemail);
  }

  @Post("createSlab")
  @ApiResponse({ status: 201, description: "slab added successfully" })
  @ApiResponse({ status: 409, description: "slab is already exist" })
  @UseGuards(AuthGuard("jwt"))
  createSlab(@Req() req, @Body() customSlabDTO: CustomSlabDTO) {
    const uemail = req.user.email;
    return this.newTaxService.createSlab(customSlabDTO, uemail);
  }
}
