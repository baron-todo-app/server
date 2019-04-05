import { Injectable } from '@nestjs/common';
import { ISoftDelete } from 'app.interface';
import * as R from 'ramda';
import { Like } from 'typeorm';

export { AppService };

@Injectable()
class AppService {
  /**
   * 論理削除用パラタメタ
   */
  throughDelete(): ISoftDelete {
    return { deleteAt: null };
  }

  /**
   * TypeORM 用の like 作成
   * Like<{bar: '%xxx%'}> になる
   *
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
      Like,
      wrap,
      escape,
    )(p);
  }
}
