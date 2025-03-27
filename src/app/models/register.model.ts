export class RegisterModel {
  fullname: string;
  address: string;
  gender: string;
  position: string;
  telNumber: string;
  username: string;
  password: string;
  
  constructor(
    fullname: string,
    address: string,
    gender: string,
    position: string,
    telNumber: string,
    username: string,
    password: string,
   
  ) {
    this.fullname = fullname;
    this.address = address;
    this.gender = gender;
    this.position = position;
    this.telNumber = telNumber;
    this.username = username;
    this.password = password;
 
  }
}

export interface RegisterRequest {
  name: string;
  fullname: string;
  gender: string;
  position: string;
  telNumber: string;
  username: string;
  password: string;
 
}
