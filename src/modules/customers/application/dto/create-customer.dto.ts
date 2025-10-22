import {
  IsEmail,
  IsNotEmpty,
  Length
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsEmail()
  email: string;
}
