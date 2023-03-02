import { ApiProperty } from "@nestjs/swagger/dist";
import { IsNumber, IsString, Min } from "class-validator";

export class NewTaxInputDto {
  @IsNumber({}, { message: "Please Enter Valid Number" })
  @ApiProperty({ description: "amount for calculate tax" })
  @Min(0)
  amount: number;

  @ApiProperty({
    description: "name of slab",
    default: "undefined",
  })
  @IsString({ message: "Name is always string" })
  name: string = "undefined";
}

export class OldTaxInputDto {
  @ApiProperty({
    description: "secrtion80C amount",
  })
  @IsNumber({}, { message: "Please Enter Valid Number" })
  // @Max(150000)
  @ApiProperty()
  @Min(0)
  section80C: number; //max value 150000

  @ApiProperty({
    description: "section80D amount",
  })
  @IsNumber({}, { message: "Please Enter Valid Number" })
  // @Max(50000)
  @Min(0)
  section80D: number; // max value 50000

  @ApiProperty({
    description: "section80TTA amount",
  })
  @IsNumber({}, { message: "Please Enter Valid Number" })
  // @Max(10000)
  @Min(0)
  section80TTA: number; // max value 10000

  @ApiProperty({
    description: "amount for calculate tax",
  })
  @IsNumber({}, { message: "Please Enter Valid Number" })
  @Min(0)
  amount: number;

  @ApiProperty({
    description: "name of slab",
    default: "undefined",
  })
  @IsString({ message: "Name is always string" })
  name: string = "undefined";
}

//old Tax
export const maxsection80D = 50000;
export const maxsection80C = 150000;
export const maxsection80TTA = 10000;

export const standardDiduction = 50000;

export const NewValueZones = [
  { minVal: 0, maxVal: 300000, per: 0 },
  { minVal: 300000, maxVal: 600000, per: 5 },
  { minVal: 600000, maxVal: 900000, per: 10 },
  { minVal: 900000, maxVal: 1200000, per: 15 },
  { minVal: 1200000, maxVal: 1500000, per: 20 },
  { minVal: 1500000, maxVal: Infinity, per: 30 },
];

export const OldValueZones = [
  { minVal: 0, maxVal: 250000, per: 0 },
  { minVal: 250000, maxVal: 500000, per: 5 },
  { minVal: 500000, maxVal: 1000000, per: 20 },
  { minVal: 1000000, maxVal: Infinity, per: 30 },
];
