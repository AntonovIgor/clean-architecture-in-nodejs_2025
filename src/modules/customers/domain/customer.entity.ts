import { Length } from 'class-validator';

import { BaseEntity } from '../../../core/base/base-entity.js';
import { Email } from '../../shared/domain/email.vo.js';
import { CustomerProps } from './customer.types.js';

export class Customer extends BaseEntity {
  readonly id: string;

  @Length(1, 100)
  readonly name: string;

  readonly email: Email;

  readonly createdAt: Date;
  readonly updatedAt?: Date;

  private constructor(props: CustomerProps) {
    super();
    Object.assign(this, props);
  }

  static create(props: { id: string; name: string; email: string | Email; createdAt: Date; updatedAt?: Date }): Customer {
    const emailVo = typeof props.email === 'string' ? Email.create(props.email) : props.email;
    const instance = new Customer({ ...props, email: emailVo });

    this.validate(instance);
    return instance;
  }

  public updateName(newName: string): Customer {
    return Customer.create({ ...this, name: newName, updatedAt: new Date(), email: this.email });
  }
}
