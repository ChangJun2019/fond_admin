import { routerRedux } from "dva/router";
import { stringify } from "qs";
import { userAccountLogin, getFakeCaptcha } from "@/services/api";
import { setAuthority } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import { reloadAuthorized } from "@/utils/Authorized";
import { setToken } from "@/utils/token";

/**
 * @desc login的model
 */

export default {
  namespace: "login",

  state: {
    status: undefined,
    token: undefined
  },

  effects: {
    * login({ payload }, { call, put }) {
      const response = yield call(userAccountLogin, payload);
      yield put({
        type: "changeLoginStatus",
        payload: response
      });
      // 登录成功
      if (response.msg === "ok") {
        reloadAuthorized();
        yield put(routerRedux.replace("/"));
      }
    },

    * getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    * logout(_, { put }) {
      yield put({
        type: "changeLoginStatus",
        payload: {
          status: false
        }
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: "/user/login"
        })
      );
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // 设置权限组件
      setAuthority(payload.scope);
      setToken(payload.token);
      return {
        ...state,
        status: payload.msg,
        token: payload.token
      };
    },
    changeLoginStatust(state,{payload}){
      return {
        status: payload.status
      };
    }
  }
};
