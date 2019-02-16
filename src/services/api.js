import { stringify } from "qs";
import request from "@/utils/request";


/* ===================================================================================   */

/**
 * 注册账号
 * @param params
 * @returns {Promise<void>}
 */
export async function userRegister(params) {
  return request("/v1/client/register", {
    method: "POST",
    body: params
  });
}


/**
 * 登录请求
 * @param params
 * @returns {Promise<void>}
 */
export async function userAccountLogin(params) {
  return request("https://52chinaweb.com/v1/token/login", {
    method: "POST",
    body: params
  });
}

/**
 * 获取一级分类
 * @returns {Promise<void>}
 */
export async function getOneTopics() {
  return request("/v1/topics");
}


/**
 * 获取一级分类下面的主题
 * @returns {Promise<void>}
 */
export async function getTowTopics(id) {
  return request(`/v1/topics/${id}`);
}

/**
 * 创建分类/主题
 * @param params
 * @returns {Promise<void>}
 */
export async function createTopics(params) {
  return request("/v1/topics",{
    method: "POST",
    body: params
  })
}

/**
 * 修改分类/主题信息
 * @param params
 * @returns {Promise<void>}
 */
export async function putTopics(params) {
  return request("/v1/topics",{
    method: "PUT",
    body: params
  })
}

/**
 * 删除分类/主题
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteTopics(id) {
  return request(`/v1/topics/${id}`,{
    method: "DELETE",
  });
}

/**
 * 获取七牛云token
 * @returns {Promise<void>}
 */
export async function queryFeatchQiNiuToken() {
  return request("/v1/token/qiniu")
}


/**
 * 获取主题关系列表
 * @returns {Promise<void>}
 */
export async function queryAllTopics() {
  return request("/v1/topics/all")
}

export async function createPosts(params) {
  return request("/v1/posts",{
    method: "POST",
    body: params
  })
}

/**
 * 获取用户消息
 * @returns {Promise<void>}
 */
export async function getAllMessages() {
  return request("/v1/message")
}

/**
 * 改变用户阅读消息后的状态
 * @param {*} params 
 */
export async function changeMessagesStatus(params) {
  return request("/v1/message/changed",{
    method: "PUT",
    body: params
  })
}




