export type Role = 'OWNER' | 'WORKER' | 'VIEWER';

export type User = {
  name: string;
  email: string;
  role: Role;
};
