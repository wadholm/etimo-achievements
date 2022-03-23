import { IAccessToken, INewAccessToken, IPartialAccessToken } from '@etimo-achievements/types';
import { AccessTokenModel } from '../models/access-token-model';
import { catchErrors } from '../utils';

export class AccessTokenRepository {
  findById(id: string): Promise<IAccessToken> {
    return catchErrors(async () => {
      return AccessTokenModel.query().findById(id);
    });
  }

  findByRefreshToken(refreshToken: string): Promise<IAccessToken> {
    return catchErrors(async () => {
      return AccessTokenModel.query().findOne({ refreshToken });
    });
  }

  create(accessToken: INewAccessToken): Promise<IAccessToken> {
    return catchErrors(async () => {
      return AccessTokenModel.query().insert(accessToken);
    });
  }

  update(accessToken: IPartialAccessToken): Promise<IAccessToken> {
    return catchErrors(async () => {
      return AccessTokenModel.query().patchAndFetchById(accessToken.id, accessToken);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return AccessTokenModel.query().deleteById(id);
    });
  }
}