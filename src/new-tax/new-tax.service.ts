import { Injectable } from "@nestjs/common";

@Injectable()
export class NewTaxService {
  constructor() {}

  taxCal() {
    
    return "Hello This is Service";
  }
}
