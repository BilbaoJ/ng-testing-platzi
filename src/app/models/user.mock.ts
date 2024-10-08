import { faker } from '@faker-js/faker';
import { User } from './user.model';

export const generateOneUser = (): User => {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    role: 'customer',
    avatar: faker.image.url()
  }
}

export const generateManyUsers = (size = 10): User[] => {
  const users: User[] = [];
  for (let index = 0; index < size; index++) {
    users.push(generateOneUser());
  }
  return [...users];
}
