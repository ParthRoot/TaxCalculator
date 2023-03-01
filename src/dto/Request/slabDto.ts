import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class CustomSlabDTO {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  slab: Slab[];
}

export class Slab {
  min: number;
  max: number = Infinity;
  per: number;
}
