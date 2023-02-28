import { DataSource } from "typeorm";
import { authUser } from "./entities/auth.entity";
import { newtax } from "./entities/newTax.tbl.entity";

export const dataSource = [
  {
    provide: "DataSource",
    useFactory: async () => {
      let ds = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "root",
        database: "income_tax_cal",
        synchronize: true,
        entities: [newtax, authUser],
      });
      return await ds.initialize();
    },
  },
];
