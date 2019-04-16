import { Injectable } from '@nestjs/common';
import { ISoftDelete } from 'app.interface';
import * as R from 'ramda';
import {IsNull} from 'typeorm';

export { AppService };

@Injectable()
class AppService {
  /**
   * 論理削除用パラタメタ
   */
  throughDelete(): ISoftDelete {
    return { deleteAt: IsNull()};
  }

  /**
   * TypeORM 用の like 作成
   * %\_ 一文字検索可能
   *
   * @param p
   */
  makeLike(p: string) {
    const escape = (e: string) =>
      e
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_');

    const wrap = (w: string) => `%${w}%`;

    return R.compose(
      wrap,
      escape,
    )(p);
  }
}
