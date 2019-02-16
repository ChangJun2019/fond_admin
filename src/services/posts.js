/**
 * @Time: 2019/1/5 3:53
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc:
 */


import request from "@/utils/request";


/**
 * 获取所有文章列表
 * @param params
 * @returns {Promise<void>}
 */
export async function getAllArticles(params) {
  return request("/v1/posts/articles",{
    method: "POST",
    body: params
  })
}

/**
 * 获取所有动态列表
 * @param params
 * @returns {Promise<void>}
 */
export async function getAllStates(params) {
  return request("/v1/posts/states",{
    method: "POST",
    body: params
  })
}

/**
 * 获取所有视频动态列表
 * @param params
 * @returns {Promise<void>}
 */
export async function getAllVideoStates(params) {
  return request("/v1/posts/vstates",{
    method: "POST",
    body: params
  })
}

/**
 * 删除内容
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDeletePosts(params) {
  return request(`/v1/posts/${params.id}`, {
    method: "DELETE"
  });
}


/**
 * 批量删除用户
 * @param params
 * @returns {Promise<void>}
 */
export async function featchBatchDeleteArticles(params) {
  return request("/v1/posts/delete", {
    method: "POST",
    body: params
  });
}

/**
 * 修改文章
 * @param params
 * @returns {Promise<void>}
 */
export async function featchChangeArticles(params) {
 return request("/v1/posts/changed",{
   method: "PUT",
   body: params
 })
}

/**
 * 修改是否精品
 * @param params
 * @returns {Promise<void>}
 */
export async function featchChangeArticlesGood(params) {
  return request(`/v1/posts/good/${params.id}`, {
    method: "PUT"
  });
}

/**
 * 修改是否推荐
 * @param params
 * @returns {Promise<void>}
 */
export async function featchChangeArticlesTop(params) {
  return request(`/v1/posts/top/${params.id}`, {
    method: "PUT"
  });
}
