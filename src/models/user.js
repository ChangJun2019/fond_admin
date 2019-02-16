import {
  getCurrentUser,
  getCurrentFollowedTopics,
  putCurrentUserInfo,
  putAddUserTags,
  fetchUserArticles,
  fetchUserStates,
  fetchUserVStates
} from "@/services/user";

export default {
  namespace: "user",

  state: {
    currentUser: {},
    currentFollowedTopics: [],
    currentUserArticles: [],
    currentUserStates: [],
    currentUserVStates: []
  },

  effects: {
    * fetchCurrent(_, { call, put }) {
      const response = yield call(getCurrentUser);
      console.log(response);
      yield put({
        type: "saveCurrentUser",
        payload: response
      });
    },
    * fetchCurrentFollowedTopics(_, { call, put }) {
      const response = yield call(getCurrentFollowedTopics);
      console.log(response);
      yield put({
        type: "saveCurrentFollowedTopics",
        payload: response
      });
    },
    * fetchUpdateUserInfo({ payload }, { call }) {
      const response = yield call(putCurrentUserInfo, payload);
      console.log(response);
    },
    * fetchUpdateUserAvatar({ payload }, { call, put }) {
      const response = yield call(putCurrentUserInfo, payload);
      console.log(response);
      yield put({
        type: "putCurrentAvatar",
        payload
      });
    },
    * fetchAddUserTags({ payload }, { call, put }) {
      const response = yield call(putAddUserTags, payload);
      console.log(response);
      yield put({
        type: "putAddUserTags",
        payload
      });
    },
    * fetchUserArticles(_,{call,put}){
      const response = yield call(fetchUserArticles);
      console.log(response);
      yield put({
        type: "saveUserArticles",
        payload:response
      });
    },
    * fetchUserStates(_,{call,put}){
      const response = yield call(fetchUserStates);
      console.log(response);
      yield put({
        type: "saveUserStates",
        payload:response
      });
    },
    * fetchUserVStates(_,{call,put}){
      const response = yield call(fetchUserVStates);
      console.log(response);
      yield put({
        type: "saveUserVStates",
        payload:response
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {}
      };
    },
    saveCurrentFollowedTopics(state, action) {
      return {
        ...state,
        currentFollowedTopics: action.payload || []
      };
    },
    putCurrentAvatar(state, action) {
      const user = { ...state.currentUser };
      user.avatar = action.payload.avatar;
      return {
        ...state,
        currentUser: user
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount
        }
      };
    },
    putAddUserTags(state, action) {
      const user = { ...state.currentUser };
      user.tags.push(action.payload.tag_title);
      return {
        ...state,
        currentUser: user
      };
    },
    saveUserArticles(state,action){
      return {
        ...state,
        currentUserArticles:action.payload
      }
    },
    saveUserStates(state,action){
      return {
        ...state,
        currentUserStates:action.payload
      }
    },
    saveUserVStates(state,action){
      return {
        ...state,
        currentUserVStates:action.payload
      }
    }
  }
};
