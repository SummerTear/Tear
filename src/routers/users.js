import { User } from '../models';

const users = async ctx => {
  const { username, email } = ctx.request.body;
  switch (ctx.params.method) {
    case 'username_available': {
      const user = await User.findByUsername(username);
      if (user) {
        ctx.body = { valid: false, message: ctx.__('USERNAME_EXISTS') };
      } else {
        ctx.body = { valid: true };
      }
      break;
    }
    case 'email_available': {
      const user = await User.findByEmail(email);
      if (user) {
        ctx.body = { valid: false, message: ctx.__('EMAIL_EXISTS') };
      } else {
        ctx.body = { valid: true };
      }
      break;
    }
    default:
      ctx.throw(ctx.__('UNAVAILABLE_METHOD'));
      break;
  }
};

export default users;
