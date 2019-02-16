/**
 * @Time: 2019/1/3 21:11
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc:
 */
import request from "@/utils/request";

/**
 * 获取所有用户信息、用于用户管理、模糊查询、限制字段查询
 * @param params
 * @returns {Promise<void>}
 */
export async function getAllUsers(params) {
  return request("/v1/user/all", {
    method: "POST",
    body: params
  });
};


/**
 * 批量删除用户
 * @param params
 * @returns {Promise<void>}
 */
export async function featchBatchDeleteUsers(params) {
  return request("/v1/user/delete", {
    method: "POST",
    body: params
  });
}

/**
 * 单独删除用户
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDeleteUser(params) {
  return request(`/v1/user/${params.id}`, {
    method: "DELETE"
  });
}


/**
 * 设置管理员
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchSetUserAuth(params) {
  return request("/v1/user/auth", {
    method: "PUT",
    body: params
  });
}


/**
 * 创建消息
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchCreateMessage(params) {
  return request("/v1/message", {
    method: "PUT",
    body: params
  });
}
