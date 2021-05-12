/**
 * @author knows 1002563923@qq.com
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */
import Vue from "vue";
import { login, logout } from "@/api/passport";
import { UserStore, TokenStore } from "@/utils/storage";
import { title, tokenName } from "@/config/settings";

const state = {
  token: TokenStore.get(),
  user: UserStore.get(),
};
const getters = {
  user: (state) => state.user,
  agent: (state) => state.agent,
  token: (state) => state.token,
  username: (state) => state.user.nickname || state.user.username || "管理员",
  avatar: (state) =>
    state.user.avatar ||
    "https://i.gtimg.cn/club/item/face/img/2/15922_100.gif",
};
const mutations = {
  setToken(state, token) {
    state.token = token;
    TokenStore.set(token);
  },
  setUser(state, user) {
    state.user = user;
    UserStore.set(user);
  },
  clearToken() {
    state.token = "";
    TokenStore.clear();
  },
};
const actions = {
  async login({ commit }, userInfo) {
    userInfo.account = userInfo.username;
    const { user, token, agent_id } = await login(userInfo);
    if (token) {
      commit("setToken", token);
      commit("setUser", user);
      const hour = new Date().getHours();
      const thisTime =
        hour < 8
          ? "早上好"
          : hour <= 11
          ? "上午好"
          : hour <= 13
          ? "中午好"
          : hour < 18
          ? "下午好"
          : "晚上好";
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`);
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        "error"
      );
    }
  },

  async logout({ commit }) {
    await logout(state.accessToken)
      .catch(() => {})
      .finally(() => commit("clearToken"));
  },
};
export default { state, getters, mutations, actions };
