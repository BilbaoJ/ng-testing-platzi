export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  avatar: string;
}

export interface CreateUserDTO extends Omit<User, 'id' | 'role'> {}
