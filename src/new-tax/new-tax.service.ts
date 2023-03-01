import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { Inject, Req, Res } from "@nestjs/common/decorators";
import { newtax } from "src/db/entities/newTax.tbl.entity";
import { slabtable } from "src/db/entities/slab.tbl.entity";
import { CustomSlabDTO } from "src/dto/Request/slabDto";
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
  private AdminRepo1: Repository<slabtable>;
  constructor(
    @Inject("DataSource")
    private dataSource: DataSource
  ) {
    this.AdminRepo = this.dataSource.getRepository(newtax);
    this.AdminRepo1 = this.dataSource.getRepository(slabtable);
  }

  async taxCal(newtaxInputDto: NewTaxInputDto, myData1) {
    let { amount, name } = newtaxInputDto;

    console.log(name);

    let tax = 0;
    // console.log(valueZones);

    const latestAmount = amount - standardDiduction; // amount after diduction

    let changeAmount; // changeAmount Slab vise
    let currentAmount;

    let nowAmount = latestAmount; // amount - standardDiduction

    if (name == "undefined") {
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
    } else {
      const slabName = JSON.parse(
        await (
          await this.AdminRepo1.findOneBy({ name })
        ).slab
      );
      let newSlabName = slabName.slab;
      // console.log("old", newSlabName[3].maxVal);
      // newSlabName[3].maxVal = Infinity;
      // console.log("new", newSlabName[3].max);

      for (let i = 0; i < newSlabName.length; i++) {
        // console.log("new", newSlabName[i].maxVal);
        if (newSlabName[i].maxVal == "Infinity") {
          newSlabName[i].maxVal = Infinity;
        }
        if (
          latestAmount > newSlabName[i].minVal &&
          latestAmount <= newSlabName[i].maxVal
        ) {
          for (let j = i; j >= 0; j--) {
            changeAmount = nowAmount - newSlabName[j].minVal;
            currentAmount = nowAmount - changeAmount;
            nowAmount = currentAmount;
            tax += (changeAmount * newSlabName[j].per) / 100;
          }
          break;
        }
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

  async oldTaxCal(oldtaxInputDto: OldTaxInputDto, myData1) {
    let { amount, section80C, section80D, section80TTA, name } = oldtaxInputDto;

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

    if (name == "undefined") {
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
    } else {
      const slabName = JSON.parse(
        await (
          await this.AdminRepo1.findOneBy({ name })
        ).slab
      );
      let newSlabName = slabName.slab;
      // console.log("old", newSlabName[3].maxVal);
      // newSlabName[3].maxVal = Infinity;
      // console.log("new", newSlabName[3].max);

      for (let i = 0; i < newSlabName.length; i++) {
        if (newSlabName[i].maxVal == "Infinity") {
          newSlabName[i].maxVal = Infinity;
        }
        // console.log("new", newSlabName[i].maxVal);
        if (
          latestAmount > newSlabName[i].minVal &&
          latestAmount <= newSlabName[i].maxVal
        ) {
          for (let j = i; j >= 0; j--) {
            changeAmount = nowAmount - newSlabName[j].minVal;
            currentAmount = nowAmount - changeAmount;
            nowAmount = currentAmount;
            tax += (changeAmount * newSlabName[j].per) / 100;
          }
          break;
        }
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

  async createSlab(customSlabDTO: CustomSlabDTO) {
    // console.log(customSlabDTO.slab);
    let { name } = customSlabDTO;

    let slab1 = customSlabDTO.slab;

    // console.log("name", name);

    let slab = JSON.stringify({
      slab: slab1,
    });

    const data = this.AdminRepo1.create({
      name,
      slab,
    });

    try {
      await this.AdminRepo1.save(data);
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException("user name already exists");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
