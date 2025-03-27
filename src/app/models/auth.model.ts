export class AuthModel {
  username: string;
  password: string;
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export interface LoginDTO {
  token: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}
