/**
 * @Time: 2018/12/20 17:09
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc: 存储token和获取token的办法
 */

export function getToken() {
  return localStorage.getItem("cj-token");
}

export function setToken(token) {
  return localStorage.setItem("cj-token", token);
}
