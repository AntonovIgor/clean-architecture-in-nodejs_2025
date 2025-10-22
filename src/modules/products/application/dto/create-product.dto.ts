import { IsNotEmpty, Length, IsNumber, Min, Max, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @Length(1, 200)
  name: string;

  @IsNumber()
  @Min(0)
  @Max(10000000)
  price: number;

  @IsNotEmpty()
  @Length(3, 3)
  currency: string;

  @IsInt()
  @Min(0)
  @Max(100000)
  stock: number;
}
