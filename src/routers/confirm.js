import { User } from '../models';
import { userState } from '../constants';
import signToken from '../utils/signToken';

const confirm = async ctx => {
  const { data } = ctx.request.body;
  const dataArray = data.split('_');
  if (dataArray.length === 2) {
    const id = dataArray[0];
    const key = dataArray[1];
    let user = await User.findById(id);
    if (
      user.state.code === userState.CONFIRM ||
      user.state.code === userState.CONFIRM_LOCK
    ) {
      if (key === user.activeKey) {
        user = await User.confirm(id);
        const token = signToken(user);
        ctx.body = {
          token: token,
          message: ctx.__('CONFIRM_SUCCESS'),
          type: 'success'
        };
      } else {
        ctx.throw(ctx.__('CONFIRM_FAILED'));
      }
    } else {
      ctx.throw(ctx.__('CONFIRM_NOT_NEEDED'));
    }
  } else {
    ctx.throw(ctx.__('REQUEST_PARAM_WRONG'));
  }
};

export default confirm;
