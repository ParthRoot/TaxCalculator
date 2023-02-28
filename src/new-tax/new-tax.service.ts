import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  standardDiduction,
  NewTaxInputDto,
  NewValueZones,
  OldValueZones,
  OldTaxInputDto,
  maxsection80D,
  maxsection80C,
  maxsection80TTA,
} from "src/dto/Request/taxInputDto";

@Injectable()
export class NewTaxService {
  constructor() {}

  taxCal(newtaxInputDto: NewTaxInputDto) {
    let { amount } = newtaxInputDto;

    let tax = 0;
    // console.log(valueZones);

    const latestAmount = amount - standardDiduction; // amount after diduction

    let changeAmount; // changeAmount Slab vise
    let currentAmount;

    let nowAmount = latestAmount; // amount - standardDiduction

    for (let i = 0; i < NewValueZones.length; i++) {
      if (
        latestAmount > NewValueZones[i].minVal &&
        latestAmount <= NewValueZones[i].maxVal
      ) {
        for (let j = i; j >= 0; j--) {
          changeAmount = nowAmount - NewValueZones[j].minVal;
          currentAmount = nowAmount - changeAmount;
          nowAmount = currentAmount;
          tax += (changeAmount * NewValueZones[j].per) / 100;
        }

        break;
      }
    }

    return tax;
  }

  oldTaxCal(oldtaxInputDto: OldTaxInputDto) {
    let { amount, section80C, section80D, section80TTA } = oldtaxInputDto;

    if (section80D > maxsection80D) {
      section80D = maxsection80D;
    }

    if (section80C > maxsection80C) {
      section80C = maxsection80C;
    }

    if (section80TTA > maxsection80TTA) {
      section80TTA = maxsection80TTA;
    }

    // console.log("Amount", amount);
    // console.log("section80C", section80C);
    // console.log("section80D", section80D);
    // console.log("section80TTA", section80TTA);
    let a = section80C + section80D + section80TTA;

    // console.log("section80c", section80C);

    if (a > amount) {
      throw new HttpException(
        "Value is out of bound",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    console.log("helloThis is dbConn");

    let tax = 0;
    // console.log(valueZones);

    const latestAmount =
      amount - standardDiduction - section80C - section80D - section80TTA; // amount after diduction

    let changeAmount; // changeAmount Slab vise
    let currentAmount;

    let nowAmount = latestAmount; // amount - standardDiduction

    console.log("nowAmount", nowAmount);

    for (let i = 0; i < OldValueZones.length; i++) {
      if (
        latestAmount > OldValueZones[i].minVal &&
        latestAmount <= OldValueZones[i].maxVal
      ) {
        for (let j = i; j >= 0; j--) {
          changeAmount = nowAmount - OldValueZones[j].minVal;
          currentAmount = nowAmount - changeAmount;
          nowAmount = currentAmount;
          tax += (changeAmount * OldValueZones[j].per) / 100;
        }

        break;
      }
    }
    // console.log(oldtaxInputDto);
    return tax;
  }
}
