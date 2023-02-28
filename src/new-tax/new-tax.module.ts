import { Module } from "@nestjs/common";
import { NewTaxController } from "./new-tax.controller";
import { NewTaxService } from "./new-tax.service";

@Module({
  imports: [],
  controllers: [NewTaxController],
  providers: [NewTaxService],
  exports: [NewTaxService],
})
export class NewTaxModule {}

// export class AppInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>
//   ): Observable<any> {
//     console.log("This is interceptor.. before");
//     const request = context.switchToHttp().getRequest();

//     const log = `http://localhost:3000${request.url}`;
//     const body = JSON.stringify(request.body);

//     const data = {
//       log,
//       body,
//     };

//     request.myData = data;

//     console.log("MyData", request.myData);

//     return next.handle().pipe(
//       tap(() => {
//         console.log("After");
//       })
//     );
//   }
// }
