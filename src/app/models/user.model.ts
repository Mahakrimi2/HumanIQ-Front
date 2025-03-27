export interface User {
  id: number;
  fullname: String;
  username: string;
  gender: string;
  address: string;
  position: string;
  salary: number;
  telNumber: string;
  hireDate: Date;
  email: string;
  password?: string;
  roles: any;
  nationalID: string;
  dateOfBirth: Date;
  accountVerified: Boolean;
  isDisabled: Boolean;
  profileImagePath: string;
  leave_balance:number;
}
