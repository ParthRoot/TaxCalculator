import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { Inject, Req, Res } from "@nestjs/common/decorators";
import { newtax } from "src/db/entities/newTax.tbl.entity";
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

import { DataSource, Repository } from "typeorm";

@Injectable()
export class NewTaxService {
  private AdminRepo: Repository<newtax>;
  constructor(
    @Inject("DataSource")
    private dataSource: DataSource
  ) {
    this.AdminRepo = this.dataSource.getRepository(newtax);
  }

  async taxCal(newtaxInputDto: NewTaxInputDto, myData1) {
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

    let log = myData1.log;
    let body = myData1.body.amount;

    let typeTax = "new";

    const data = this.AdminRepo.create({
      log,
      amount: body,
      tax,
      typeTax,
    });

    try {
      this.AdminRepo.save(data);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return tax;
  }

  oldTaxCal(oldtaxInputDto: OldTaxInputDto, myData1) {
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

    let tax = 0;
    // console.log(valueZones);

    const latestAmount =
      amount - standardDiduction - section80C - section80D - section80TTA; // amount after diduction

    let changeAmount; // changeAmount Slab vise
    let currentAmount;

    let nowAmount = latestAmount; // amount - standardDiduction

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

    let log = myData1.log;
    let body = myData1.body.amount;

    let typeTax = "old";

    const data = this.AdminRepo.create({
      log,
      amount: body,
      tax,
      typeTax,
    });

    try {
      this.AdminRepo.save(data);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    // console.log(oldtaxInputDto);
    return tax;
  }
}
