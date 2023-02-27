import { ValidationPipe } from "@nestjs/common";
import { IsNumber } from "class-validator";

export class TaxInputDto {
  @IsNumber({}, { message: "Please Enter Valid Number" })
  amount: number;
}

export const standardDiduction = 50000;

export const valueZones = [
  { minVal: 0, maxVal: 300000, per: 0 },
  { minVal: 300000, maxVal: 600000, per: 5 },
  { minVal: 600000, maxVal: 900000, per: 10 },
  { minVal: 900000, maxVal: 1200000, per: 15 },
  { minVal: 1200000, maxVal: 1500000, per: 20 },
  { minVal: 1500000, maxVal: Infinity, per: 30 },
];
