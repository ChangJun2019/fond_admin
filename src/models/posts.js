/**
 * @Time: 2018/12/29 22:34
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc:
 */
import { queryAllTopics, createPosts } from "@/services/api";
import {
  getAllArticles,
  getAllStates,
  getAllVideoStates,
  fetchDeletePosts,
  featchBatchDeleteArticles,
  featchChangeArticles,
  featchChangeArticlesGood,
  featchChangeArticlesTop
} from "@/services/posts";

export default {
  namespace: "posts",

  state: {
    all_topics: [],
    allArticles: [],
    allStates: {},
    allVideoStates: {}
  },

  effects: {
    * fetchAllTopics(_, { call, put }) {
      const response = yield call(queryAllTopics);
      yield put({
        type: "queryAllTopics",
        payload: Array.isArray(response) ? response : []
      });
    },
    * submitPostsForm({ payload }, { call }) {
      const response = yield call(createPosts, payload);
      console.log(response);
    },
    * fetchAllArticles({ payload }, { call, put }) {
      const response = yield call(getAllArticles, payload);
      yield put({
        type: "saveAllArticles",
        payload: response
      });
    },
    * fetchAllStates({ payload }, { call, put }) {
      const response = yield call(getAllStates, payload);
      console.log(response);
      yield put({
        type: "saveAllStates",
        payload: response
      });
    },
    * fetchAllVideoStates({ payload }, { call, put }) {
      const response = yield call(getAllVideoStates, payload);
      console.log(response);
      yield put({
        type: "saveAllVideoStates",
        payload: response
      });
    },
    * deletePosts({ payload }, { call,put }) {
      const response = yield call(fetchDeletePosts, payload);
      console.log(response);
      if(payload.type===1){
        yield put({
          type:"deleteArticlesPosts",
          payload
        })
      }
      if(payload.type===2){
        yield put({
          type:"deleteStatesPosts",
          payload
        })
      }
      if(payload.type===3){
        yield put({
          type:"deleteVideoStatesPosts",
          payload
        })
      }
    },
    * batchDeletePosts({ payload }, { call }) {
      const response = yield call(featchBatchDeleteArticles, payload);
      console.log(response);
    },
    * changeArticles({ payload }, { call }) {
      const response = yield call(featchChangeArticles, payload);
      console.log(response);
    },
    * changeArticlesGood({ payload }, { call, put }) {
      const response = yield call(featchChangeArticlesGood, payload);
      console.log(response);
      if(payload.type===2){
        yield put({
          type: "changeStatesGoodState",
          payload
        });
      }
      if(payload.type===1){
        yield put({
          type: "changeArticlesGoodState",
          payload
        });
      }
      if(payload.type ===3){
        yield put({
          type: "changeVideoStatesGoodState",
          payload
        });
      }
    },
    * changeArticlesTop({ payload }, { call,put }) {
      const response = yield call(featchChangeArticlesTop, payload);
      console.log(response);
      if(payload.type===2){
        yield put({
          type: "changeStatesTopState",
          payload
        });
      }
      if(payload.type===1){
        yield put({
          type:"changeArticlesTopState",
          payload
        })
      }
      if (payload.type===3){
        yield put({
          type:"changeArticlesTopVideoStates",
          payload
        })
      }
    }
  },

  reducers: {
    queryAllTopics(state, action) {
      return {
        ...state,
        all_topics: action.payload
      };
    },
    saveAllArticles(state, action) {
      const res = { ...action.payload };
      res.pagination.showQuickJumper = true;
      return {
        ...state,
        allArticles: res
      };
    },
    saveAllStates(state, action) {
      const res = { ...action.payload };
      res.pagination.showQuickJumper = true;
      return {
        ...state,
        allStates: res
      };
    },
    saveAllVideoStates(state, action) {
      const res = { ...action.payload };
      res.pagination.showQuickJumper = true;
      return {
        ...state,
        allVideoStates: res
      };
    },
    changeArticlesGoodState(state, action) {
      const articles = { ...state.allArticles };
      const { id } = action.payload;
      const index = articles.list.findIndex(e => e.id === id);
      articles.list[index].good = articles.list[index].good === 0 ? 1 : 0;
      return {
        ...state,
        allArticles: articles
      };
    },
    changeStatesGoodState(state, action) {
      const states = { ...state.allStates };
      const { id } = action.payload;
      const index = states.list.findIndex(e => e.id === id);
      states.list[index].good = states.list[index].good === 0 ? 1 : 0;
      return {
        ...state,
        allStates: states
      };
    },
    changeArticlesTopState(state, action) {
      const articles = { ...state.allArticles };
      const { id } = action.payload;
      const index = articles.list.findIndex(e => e.id === id);
      articles.list[index].top = articles.list[index].top === 0 ? 1 : 0;
      return {
        ...state,
        allArticles: articles
      };
    },
    changeStatesTopState(state, action) {
      const states = { ...state.allStates };
      const { id } = action.payload;
      const index = states.list.findIndex(e => e.id === id);
      states.list[index].top = states.list[index].top === 0 ? 1 : 0;
      return {
        ...state,
        allStates: states
      };
    },
    changeArticlesTopVideoStates(state,action){
      const states = { ...state.allVideoStates };
      const { id } = action.payload;
      const index = states.list.findIndex(e => e.id === id);
      states.list[index].top = states.list[index].top === 0 ? 1 : 0;
      return {
        ...state,
        allVideoStates: states
      };
    },
    changeVideoStatesGoodState(state,action){
      const states = { ...state.allVideoStates };
      const { id } = action.payload;
      const index = states.list.findIndex(e => e.id === id);
      states.list[index].good = states.list[index].good === 0 ? 1 : 0;
      return {
        ...state,
        allVideoStates: states
      };
    },
    deleteStatesPosts(state,action){
      const posts = { ...state.allArticles };
      const { id } = action.payload;
      const index = posts.list.findIndex(e => e.id === id);
      posts.list.splice(index);
      return {
        ...state,
        allArticles: posts
      };
    },
    deleteArticlesPosts(state,action){
      const posts = { ...state.allStates };
      const { id } = action.payload;
      const index = posts.list.findIndex(e => e.id === id);
      posts.list.splice(index);
      return {
        ...state,
        allStates: posts
      };
    },
    deleteVideoStatesPosts(state,action){
      const posts = { ...state.allVideoStates };
      const { id } = action.payload;
      const index = posts.list.findIndex(e => e.id === id);
      posts.list.splice(index);
      return {
        ...state,
        allVideoStates: posts
      };
    }
  }
};
