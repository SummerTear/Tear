import { User as db } from '../connectors';
import { userState } from '../constants';

const findById = id => db.findById(id).exec();

const findByEmail = email => db.findOne({ email }).exec();

const findByUsername = username => db.findOne({ username }).exec();

const findByPhone = phone => db.findOne({ phone }).exec();

// 验证用户成功，将用户状态从需要验证状态改为可用状态，并返回修改后的状态
const confirm = async id => {
  const user = await db.findById(id).exec();
  const code = user.state.code;
  switch (code) {
    case userState.CONFIRM:
      user.state.code = userState.ACTIVE;
      user.activeKey = null;
      user.save();
      break;
    case userState.CONFIRM_LOCK:
      user.state.code = userState.ACTIVE_LOCK;
      user.activeKey = null;
      user.save();
      break;
  }
  return user;
};

// 锁定用户及原因
const lock = async (id, message) => {
  const user = await db.findById(id).exec();
  const code = user.state.code;
  switch (code) {
    case userState.ACTIVE:
      user.state.code = userState.ACTIVE_LOCK;
      user.state.message = message;
      user.save();
      break;
    case userState.CONFIRM:
      user.state.code = userState.CONFIRM_LOCK;
      user.state.message = message;
      user.save();
      break;
  }
};

// 解锁用户及原因
const unlock = async (id, message) => {
  const user = await db.findById(id).exec();
  const code = user.state.code;
  switch (code) {
    case userState.ACTIVE_LOCK:
      user.state.code = userState.ACTIVE;
      user.state.message = message;
      user.save();
      break;
    case userState.CONFIRM_LOCK:
      user.state.code = userState.CONFIRM;
      user.state.message = message;
      user.save();
      break;
  }
};

const add = user => db.create(user);

const update = (id, obj) =>
  db
    .findByIdAndUpdate(
      id,
      {
        $set: obj
      },
      { new: true }
    )
    .exec();

const User = {
  findById,
  findByEmail,
  findByUsername,
  findByPhone,
  update,
  confirm,
  lock,
  unlock,
  add
};

export default User;
