import { getOneTopics, getTowTopics, createTopics, putTopics,deleteTopics } from "@/services/api";

export default {
  namespace: "topics",

  state: {
    OneTopics: [],  // 一级分类
    TowTopics: []   // 二级分类
  },

  effects: {
    * fetchOneTopics(_, { call, put }) {
      const response = yield call(getOneTopics);
      console.log(response);
      yield put({
        type: "queryOneTopic",
        payload: Array.isArray(response) ? response : []
      });
    },
    * fetchTowTopics({ payload }, { call, put }) {
      const response = yield call(getTowTopics, payload.id);
      console.log(response);
      yield put({
        type: "queryTowTopic",
        payload: Array.isArray(response) ? response : []
      });
    },
    * fetchCreateTopic({ payload }, { call, put }) {
      const response = yield call(createTopics, payload);
      console.log(response);
      const id = response.msg.topic_id;
      if(!payload.parent_id){
        yield put({
          type: "appendOneTopics",
          payload: { id, ...payload }
        });
      }else{
        yield put({
          type: "appendTowTopics",
          payload: { id, ...payload }
        });
      }

    },
    * fetchUpdateTopic({ payload }, { call, put }) {
      const response = yield call(putTopics, payload);
      console.log(response);
      if(!payload.parent_id){
        yield put({
          type: "putOneTopics",
          payload: { ...payload }
        });
      }else{
        yield put({
          type: "putTowTopics",
          payload: { ...payload }
        });
      }

    },
    * fetchDeleteTopic({ payload }, { call, put }) {
      const response = yield call(deleteTopics,payload.id);
      console.log(response);
      if(!payload.parent_id){
        yield put({
          type:"deleteOneTopics",
          payload:{...payload}
        })
      }else{
        yield put({
          type:"deleteTowTopics",
          payload:{...payload}
        })
      }
    }
  },

  reducers: {
    queryOneTopic(state, action) {
      return {
        ...state,
        OneTopics: action.payload
      };
    },
    queryTowTopic(state, action) {
      return {
        ...state,
        TowTopics: action.payload
      };
    },
    appendOneTopics(state, action) {
      return {
        ...state,
        OneTopics: state.OneTopics.concat(action.payload)
      };
    },
    appendTowTopics(state, action) {
      return {
        ...state,
        TowTopics: state.TowTopics.concat(action.payload)
      };
    },
    putOneTopics(state, action) {
      const topics = [...state.OneTopics];
      const index = topics.findIndex(o => o.id === action.payload.id);
      topics[index] = action.payload;
      return {
        ...state,
        OneTopics: topics
      };
    },
    putTowTopics(state, action) {
      const topics = [...state.TowTopics];
      const index = topics.findIndex(o => o.id === action.payload.id);
      topics[index] = action.payload;
      return {
        ...state,
        TowTopics: topics
      };
    },
    deleteOneTopics(state,action){
      const topics = [...state.OneTopics];
      const index = topics.findIndex(o => o.id === action.payload.id);
      topics.splice(index);
      return {
        ...state,
        OneTopics: topics
      };
    },
    deleteTowTopics(state,action){
      const Towtopics = [...state.TowTopics];
      const index = Towtopics.findIndex(o => o.id === action.payload.id);
      Towtopics.splice(index);
      return {
        ...state,
        TowTopics: Towtopics
      };
    }
  }
};
