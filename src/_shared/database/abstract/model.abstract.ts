export abstract class ITimestamp {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export abstract class Person extends ITimestamp {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  address?: string;
  isActivated?: boolean;
}
