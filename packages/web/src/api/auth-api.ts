import { TokenInfoDto } from '../common/dtos/token-info-dto';
import { UserInfoDto } from '../common/dtos/user-info-dto';
import Api from '../common/utils/api';

export class AuthApi {
  private api = new Api();

  public logout() {
    return this.api.get('/auth/logout');
  }

  public callback(provider: string, code: string) {
    return this.api.get(`/auth/callback/${provider}?code=${code}`);
  }

  public validate() {
    return this.api.get('/auth/validate');
  }

  public refresh() {
    return this.api.get('/auth/refresh');
  }

  public userInfo() {
    return this.api.get<UserInfoDto>('/auth/userinfo');
  }

  public introspect() {
    return this.api.get<TokenInfoDto>('/auth/introspect');
  }
}