/**
 * @Time: 2019/1/3 21:03
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc:
 */
import { getAllUsers, featchBatchDeleteUsers,fetchDeleteUser,fetchSetUserAuth,fetchCreateMessage } from "@/services/users";


export default {
  namespace: "users",

  state: {
    allUsers: {}
  },

  effects: {
    * featchAllUsers({ payload }, { call, put }) {
      const response = yield call(getAllUsers, payload);
      console.log(response);
      yield put({
        type: "saveAllUsers",
        payload: response
      });
    },
    * batchDeleteUsers({ payload }, { call }) {
      const response = yield call(featchBatchDeleteUsers, payload);
      console.log(response);
    },
    * deleteUser({payload},{call}){
      const response = yield call(fetchDeleteUser,payload);
      console.log(response);
    },
    * setUserAuth({payload},{call}){
      const response = yield call(fetchSetUserAuth,payload);
      console.log(response);
    },
    * fetchCreateMessage({payload},{call}){
      const response = yield call(fetchCreateMessage,payload);
    }
  },

  reducers: {
    saveAllUsers(state, action) {
      const res = { ...action.payload };
      res.pagination.showQuickJumper = true;
      return {
        ...state,
        allUsers: res
      };
    }
  }
};
