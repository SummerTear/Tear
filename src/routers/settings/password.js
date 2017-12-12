import bcrypt from 'bcrypt';
import { User } from '../../models';
import signToken from '../../utils/signToken';

const password = async ctx => {
  const { current, password } = ctx.request.body;
  if (current && password) {
    let user = await User.findById(ctx.state.user.id);
    const result = await bcrypt.compare(current, user.password);
    if (result) {
      const tokenVersion = user.tokenVersion + 1;
      const passwordToSave = await bcrypt.hash(password, 10); // saltRounds = 10
      user = await User.update(user._id, {
        password: passwordToSave,
        tokenVersion
      });
      const token = signToken(user);
      ctx.body = {
        token: token,
        message: ctx.__('UPDATE_SUCCESS'),
        type: 'success'
      };
    } else {
      // 密码错误
      ctx.throw(ctx.__('PASSWORD_WRONG'));
    }
  } else {
    // 请求参数错误
    ctx.throw(ctx.__('REQUEST_PARAM_WRONG'));
  }
};

export default password;
