import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Inject } from "@nestjs/common/decorators";
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

  // newTaxCal -----------------------------------------------------------------------

  async taxCal(newtaxInputDto: NewTaxInputDto, myData1, uemail) {
    let { amount, name } = newtaxInputDto;

    // console.log("Length", amount.toString().length);
    // console.log(amount.toString());
    if (amount.toString().length >= 20) {
      throw new HttpException("RangeOutofBound", HttpStatus.NOT_ACCEPTABLE);
    }

    let tax = 0;

    const latestAmount = amount - standardDiduction; // amount after diduction

    let changeAmount; // changeAmount Slab vise
    let currentAmount;

    let nowAmount = latestAmount; // amount - standardDiduction
    let typeTax = "new";
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
      typeTax = name;
      let email = uemail;
      let slabName;
      try {
        let uemail = await this.AdminRepo1.findBy({ email });

        slabName = JSON.parse(
          uemail.find((uemail) => uemail.name == name).slab
        );

        // slabName = JSON.parse(
        //   await (
        //     await this.AdminRepo1.findOneBy({ name })
        //   ).slab
        // );

        // console.log(slabName);
      } catch (error) {
        throw new NotFoundException(`${name} slab is not found`);
      }

      let newSlabName = slabName.slab;

      for (let i = 0; i < newSlabName.length; i++) {
        if (newSlabName[i].maxVal == "infinity") {
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

    const data = this.AdminRepo.create({
      log,
      amount: body,
      tax,
      typeTax,
    });

    try {
      this.AdminRepo.save(data);
    } catch (error) {
      throw new InternalServerErrorException("something went wrong");
    }

    return tax;
  }

  // oldTaxCal -----------------------------------------------------------------------
  async oldTaxCal(oldtaxInputDto: OldTaxInputDto, myData1, uemail) {
    let { amount, section80C, section80D, section80TTA, name } = oldtaxInputDto;

    if (
      amount.toString().length >= 20 ||
      section80D.toString().length >= 20 ||
      section80C.toString().length >= 20 ||
      section80TTA.toString().length >= 20
    ) {
      throw new HttpException("RangeOutofBound", HttpStatus.NOT_ACCEPTABLE);
    }

    if (section80D > maxsection80D) {
      section80D = maxsection80D;
    }

    if (section80C > maxsection80C) {
      section80C = maxsection80C;
    }

    if (section80TTA > maxsection80TTA) {
      section80TTA = maxsection80TTA;
    }

    let a = section80C + section80D + section80TTA;

    if (a > amount) {
      throw new HttpException(
        "Value is out of bound",
        HttpStatus.NOT_ACCEPTABLE
      );
    }

    let tax = 0;

    const latestAmount =
      amount - standardDiduction - section80C - section80D - section80TTA; // amount after diduction

    let changeAmount;
    let currentAmount;

    let nowAmount = latestAmount;

    let typeTax = "old";

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
      typeTax = name;
      let email = uemail;
      let slabName;
      try {
        let uemail = await this.AdminRepo1.findBy({ email });

        slabName = JSON.parse(
          uemail.find((uemail) => uemail.name == name).slab
        );
        // slabName = JSON.parse(
        //   await (
        //     await this.AdminRepo1.findOneBy({ name })
        //   ).slab
        // );
      } catch (error) {
        throw new NotFoundException(`${name} slab is not found`);
      }
      let newSlabName = slabName.slab;

      for (let i = 0; i < newSlabName.length; i++) {
        if (newSlabName[i].maxVal == "infinity") {
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

    const data = this.AdminRepo.create({
      log,
      amount: body,
      tax,
      typeTax,
    });

    try {
      this.AdminRepo.save(data);
    } catch (error) {
      throw new InternalServerErrorException("something went wrong");
    }
    return tax;
  }

  // createSlab -----------------------------------------------------------------------
  async createSlab(customSlabDTO: CustomSlabDTO, email) {
    let { name } = customSlabDTO;

    let slab1 = customSlabDTO.slab;

    let uemail = await this.AdminRepo1.findBy({ email });

    var result = uemail.find((item) => item.name == name);

    // console.log("result", result);

    // console.log(uemail);

    // console.log(uemail);

    let slab = JSON.stringify({
      slab: slab1,
    });

    const data = this.AdminRepo1.create({
      name,
      slab,
      email,
    });

    try {
      // console.log("first");
      if (result == undefined) {
        // console.log(result);

        await this.AdminRepo1.save(data);
        return "Slab Added Successfully";
      } else {
        throw new ConflictException("slab is already exists");
      }
      // await this.AdminRepo1.save(data);
    } catch (error) {
      // throw new ConflictException("user name already exists");
      throw new ConflictException("slab is already exists");
      // if (error.code === "23505") {

      // } else {
      //   throw new InternalServerErrorException("u");
      // }

      // throw new InternalServerErrorException("some thing went wrong");
    }
  }
}
