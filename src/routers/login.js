import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

import { User } from '../models';
import signToken from '../utils/signToken';

const login = async ctx => {
  const { username, password } = ctx.request.body;
  if (username && password) {
    let user;
    if (isEmail(username)) {
      user = await User.findByEmail(username);
    } else if (isMobilePhone(username, 'zh-CN')) {
      user = await User.findByPhone(username);
    } else {
      user = await User.findByUsername(username);
    }
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      // 验证成功
      if (result) {
        const token = signToken(user);
        ctx.body = { token: token };
      } else {
        // 密码错误
        ctx.throw(ctx.__('PASSWORD_WRONG'));
      }
    } else {
      // 用户名错误
      ctx.throw(ctx.__('USER_NOT_FOUND'));
    }
  } else {
    // 请求参数错误
    ctx.throw(ctx.__('REQUEST_PARAM_WRONG'));
  }
};

export default login;
