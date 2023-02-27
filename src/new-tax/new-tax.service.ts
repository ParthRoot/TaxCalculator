import { Injectable } from "@nestjs/common";
import {
  standardDiduction,
  TaxInputDto,
  valueZones,
} from "src/dto/Request/taxInputDto";

@Injectable()
export class NewTaxService {
  constructor() {}

  taxCal(taxInputDto: TaxInputDto) {
    let { amount } = taxInputDto;

    let tax = 0;
    // console.log(valueZones);

    const latestAmount = amount - standardDiduction; // amount after diduction

    let changeAmount; // changeAmount Slab vise
    let currentAmount;

    let nowAmount = latestAmount; // amount - standardDiduction

    for (let i = 0; i < valueZones.length; i++) {
      if (
        latestAmount > valueZones[i].minVal &&
        latestAmount <= valueZones[i].maxVal
      ) {
        for (let j = i; j >= 0; j--) {
          changeAmount = nowAmount - valueZones[j].minVal;
          currentAmount = nowAmount - changeAmount;
          nowAmount = currentAmount;
          tax += (changeAmount * valueZones[j].per) / 100;
        }

        break;
      }
    }

    return tax;
  }
}
