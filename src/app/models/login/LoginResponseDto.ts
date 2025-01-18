export class LoginResponseDto {
  token: string;
  expireInSeconds: number;

  constructor() {
    this.token = '';
    this.expireInSeconds = 0;
  }
}
