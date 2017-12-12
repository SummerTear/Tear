export const userState = {
  ACTIVE: 1, // 帐号已经验证
  CONFIRM: 0, // 帐号需要验证
  ACTIVE_LOCK: -1, // 帐号已经验证，但被锁定
  CONFIRM_LOCK: -2 // 帐号需要验证，但被锁定
};
