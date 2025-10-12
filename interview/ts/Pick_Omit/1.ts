type User = { id: number; name: string; email: string; admin?: boolean;password:string };
type PublicUser = Pick<User, 'id' | 'name'>;
// 等价于：{ id: number; name: string }
type Id = Pick<User, 'id'>;

type exE = Omit<User, 'email'>;

type SafeUser = Omit<User, 'password'>;

