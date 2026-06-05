export interface User {
  id: string;
  userId: string;
  name: string;
  role: string;
  subrole: string;
  phone: string;
  joiningDate: string;
  endDate: string;
  lastActive: string;
  payment: boolean;
}

export interface LoginPayload {
  userId: string;
  password: string;
}

export interface LoginData {
  token: string;
  user: User;
}