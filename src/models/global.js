import { getAllMessages, queryFeatchQiNiuToken, changeMessagesStatus } from "@/services/api";

export default {
  namespace: "global",

  state: {
    collapsed: false,
    notices: {},
    qntoken: ""
  },

  effects: {
    * fetchNotices(_, { call, put }) {
      const res = yield call(getAllMessages);
      yield put({
        type: "saveNotices",
        payload: res
      });
    },
    * fetchQiNiuToken(_, { call, put }) {
      const data = yield call(queryFeatchQiNiuToken);
      if (data) {
        yield put({
          type: "saveQiNiuToken",
          payload: {
            token: data.msg.token
          }
        });
      }
    },
    * clearNotices(_, { put }) {
      yield put({
        type: "saveClearedNotices"
      });
    },
    * changeNoticeReadState({ payload }, { call }) {
      const data = yield call(changeMessagesStatus, payload);
      console.log(data);
    }
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload
      };
    },
    saveQiNiuToken(state, { payload }) {
      return {
        ...state,
        qntoken: payload.token
      };
    },
    saveClearedNotices(state) {
      return {
        ...state,
        notices: {}
      };
    }
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== "undefined") {
          window.ga("send", "pageview", pathname + search);
        }
      });
    }
  }
};
