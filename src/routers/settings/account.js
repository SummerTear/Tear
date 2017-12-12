import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import { User } from '../../models';
import signToken from '../../utils/signToken';
import { userState } from '../../constants';

const validateUsername = username => /^[a-zA-Z0-9_-]{3,15}$/.test(username);

const validateEmail = email => isEmail(email);

const account = async ctx => {
  const { username, email, password } = ctx.request.body;
  if (username && email && password) {
    if (validateUsername(username) && validateEmail(email)) {
      let user = await User.findById(ctx.state.user.id);
      if (username !== user.username) {
        let result = await User.findByUsername(username);
        if (result) {
          ctx.throw(ctx.__('USERNAME_EXISTS'));
        }
      }
      if (email !== user.email) {
        let result = await User.findByEmail(email);
        if (result) {
          ctx.throw(ctx.__('EMAIL_EXISTS'));
        }
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const objToSave = { username, email };
        if (email !== user.email) {
          if (user.state.code === userState.ACTIVE) {
            objToSave.state = { code: userState.CONFIRM };
          } else if (user.state.code === userState.ACTIVE_LOCK) {
            objToSave.state = { code: userState.CONFIRM_LOCK };
          }
        }
        user = await User.update(user._id, objToSave);
        const token = signToken(user);
        ctx.body = {
          token: token,
          message: ctx.__('UPDATE_SUCCESS'),
          type: 'success'
        };
      } else {
        //密码错误
        ctx.throw(ctx.__('PASSWORD_WRONG'));
      }
    } else {
      //请求参数错误
      ctx.throw(ctx.__('REQUEST_PARAM_WRONG'));
    }
  } else {
    //请求参数错误
    ctx.throw(ctx.__('REQUEST_PARAM_WRONG'));
  }
};

export default account;
