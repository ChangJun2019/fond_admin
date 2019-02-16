import { userRegister } from "@/services/api";
import { setAuthority } from "@/utils/authority";
import { reloadAuthorized } from "@/utils/Authorized";


/**
 * 注册models
 */

export default {
  namespace: "register",

  state: {
    status: undefined
  },

  effects: {
    * submit({ payload }, { call, put }) {
      const response = yield call(userRegister, payload);
      console.log(`这是我注册用户服务端的响应${response}`);
      yield put({
        type: "registerHandle",
        payload: response
      });
    },
    * clearRegisterStatus(_, { put }) {
      yield put({
        type: "clearRegisterStatus"
      });
    }
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority("user");
      reloadAuthorized();
      return {
        ...state,
        status: payload.msg
      };
    },
    clearRegisterStatus(state) {
      return {
        ...state,
        status: false
      };
    }
  }
};
