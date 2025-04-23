import { faker } from '@faker-js/faker/.';
import { User } from 'database/model/user.entity';

export const USER_DATA: Partial<User> = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
};

export const USER_MODEL_DATA: Partial<User> = {
  id: faker.string.uuid(),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};
