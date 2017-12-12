import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import md5 from 'md5';
import bcrypt from 'bcrypt';
import shortid from 'shortid';
import sendRegisterEmail from '../utils/sendRegisterEmail';
import signToken from '../utils/signToken';
import { User } from '../models';

const register = async ctx => {
  // 这里的username指电话号码或邮箱
  let { nickname, username, password } = ctx.request.body;
  if (nickname && username && password) {
    nickname = nickname.trim();
    username = username.trim();
    const locale = ctx.cookies.lang || 'en';
    if (isEmail(username)) {
      // 邮箱注册部分
      // 检查用户是否存在
      const userExist = await User.findByEmail(username);
      if (userExist) {
        ctx.throw(ctx.__('EMAIL_ALREADY_REGISTERED'));
      } else {
        const customKey = 'Love Tear'; // TODO just for fun
        const activeKey = md5(`${username}${Date.now()}${customKey}`);
        const passwordToSave = await bcrypt.hash(password, 10); // saltRounds = 10
        // 添加用户
        const user = await User.add({
          username: `user_${shortid.generate()}`, // 这里的username是数据库里用户的用户名，可以用来登录和个性域名
          email: username, // 这里的username是客户端传的参数，可能是email或手机号，这里是email
          nickname: nickname, // 昵称，可修改，可重复
          password: passwordToSave,
          activeKey: activeKey // 用于邮箱验证
        });
        // 生成token
        const token = signToken(user);
        // 发送邮件
        await sendRegisterEmail(username, user._id, activeKey);
        ctx.body = { token: token };
      }
    } else if (isMobilePhone(username, locale)) {
      // TODO 手机注册
      ctx.throw(ctx.__('PHONE_REGISTER_NOT_SUPPORT_NOW'));
    } else {
      ctx.throw(ctx.__('REQUEST_PARAM_WRONG'));
    }
  } else {
    // 请求参数错误
    ctx.throw(ctx.__('REQUEST_PARAM_WRONG'));
  }
};

export default register;
