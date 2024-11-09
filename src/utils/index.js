/*
 * @Author: dfh
 * @Date: 2023-02-20 14:31:25
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe:
 */
const {
  miniProgram: { envVersion }
} = uni.getAccountInfoSync();
//设置token
export function setToken(token) {
  uni.setStorageSync(`${envVersion}_token`, token);
}
//获取token
export function getToken() {
  return uni.getStorageSync(`${envVersion}_token`);
}

//设置openId
export function setOpenId(openid) {
  uni.setStorageSync(`${envVersion}_openid`, openid);
}
//获取openId
export function getOpenId() {
  return uni.getStorageSync(`${envVersion}_openid`);
}

//手机号校验
export function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber) return false;
  var regex = /^(\+?86|0)?1\d{10}$/;
  return regex.test(phoneNumber);
}
