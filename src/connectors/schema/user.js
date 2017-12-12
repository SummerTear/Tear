import mongoose from 'mongoose';
import { userState } from '../../constants';

const UserSchema = new mongoose.Schema({
  email: { type: String, trim: true },
  password: { type: String, required: true },
  username: { type: String, required: true, trim: true },
  nickname: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  birthday: Date,
  activeKey: { type: String }, // 邮箱验证时的验证码
  state: {
    code: { type: Number, required: true, default: userState.CONFIRM },
    message: String // 为帐号所处状态提供信息，比如帐号被锁定时提供被锁定的原因
  },
  tokenVersion: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
  // expires: { type: Date, default: Date.now, expires: '15m' } // 15分钟过期，验证成功的话就不过期(暂时还是不要用这个策略)
});

export default mongoose.model('User', UserSchema);
