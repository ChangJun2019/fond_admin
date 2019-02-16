import request from "@/utils/request";

export async function query() {
  return request("/v1/users");
}

export async function queryCurrent() {
  return request("/v1/currentUser");
}

/* ==============================================自己的后端接口地址 ===================================== */

/**
 * 获取当前用户的信息
 * @returns {Promise<void>}
 */
export async function getCurrentUser() {
  return request("/v1/user");
}

/**
 * 获取当前用户关注的主题
 * @returns {Promise<void>}
 */
export async function getCurrentFollowedTopics() {
  return request("/v1/user/followed");
}

/**
 * 修改当前登录用户信息
 * @param params
 * @returns {Promise<void>}
 */
export async function putCurrentUserInfo(params) {
  return request("/v1/user", {
    method: "PUT",
    body: params
  });
}


/**
 * 添加标签
 * @param params
 * @returns {Promise<void>}
 */
export async function putAddUserTags(params) {
  return request("/v1/user/tags", {
    method: "PUT",
    body: params
  });
}

/**
 * 获取当前用户的发布的文章列表分页
 * @param params
 * @returns {Promise<void>}
 */
export async function featchUserArticles(params) {
  return request('/v1/posts/articles/all',{
    method: "POST",
    body: params
  })
}

/**
 * 获取当前用户的发布的文章列表不分页
 * @returns {Promise<void>}
 */
export async function fetchUserArticles() {
  return request("/v1/posts/articles")
}

/**
 * 获取当前用户发布的动态内容列表
 * @returns {Promise<void>}
 */
export async function fetchUserStates() {
  return request("/v1/posts/states")
}

export async function fetchUserVStates() {
  return request("/v1/posts/vstates")
}
