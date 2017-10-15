/**
 * 暂不提供web服务
 */
import initial from './common/initial/';
import models from './common/models/';

models()
.then(async () => {
  await initial();
});