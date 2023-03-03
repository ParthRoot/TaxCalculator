import { ApiProperty } from "@nestjs/swagger";  
import { IsArray, IsString, ValidateNested } from "class-validator";

export class CustomSlabDTO {
  @ApiProperty({
    description: "name of slab",
    example: "Parth",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "custome slab",
    example: [{ min: 1000000, max: 500000, per: 5 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  slab: Slab[];
}

export class Slab {
  min: number;

  max: number = Infinity;

  per: number;
}
