import { Email } from '../../shared/domain/email.vo.js';

export interface CustomerProps {
  id: string;
  name: string;
  email: Email;
  createdAt: Date;
  updatedAt?: Date;
}
