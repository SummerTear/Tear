import jwt from 'jsonwebtoken';
import { serverConfig } from '../config';

export default function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      nickname: user.nickname,
      username: user.username,
      state: user.state.code,
      version: user.tokenVersion
    },
    serverConfig.jwt.key,
    {
      expiresIn: serverConfig.jwt.expiresIn
    }
  );
}
