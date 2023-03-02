import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

export class CustomSlabDTO {
  @ApiProperty({
    description: "name of slab",
  })
  @IsString()
  name: string;

  @ApiProperty({ description: "custome slab" })
  @IsArray()
  @ValidateNested({ each: true })
  slab: Slab[];
}

export class Slab {
  min: number;

  max: number = Infinity;

  per: number;
}
