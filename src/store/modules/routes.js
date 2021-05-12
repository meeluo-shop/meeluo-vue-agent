/**
 * @author knows 1002563923@qq.com
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes } from "@/router";
import { filterRoutes } from "@/utils/routes";

const state = { isInitRouter: false, routes: [], partialRoutes: [] };
const getters = {
  isInitRouter: (state) => state.isInitRouter,
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
};
const mutations = {
  setRoutes(state, routes) {
    state.isInitRouter = true;
    state.routes = routes;
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = routes;
  },
  resetIsInitRouter(state) {
    state.isInitRouter = false;
  },
};
const actions = {
  async setRoutes({ commit }) {
    const finallyRoutes = filterRoutes([...constantRoutes, ...asyncRoutes]);
    commit("setRoutes", finallyRoutes);
    return [...asyncRoutes];
  },
  setPartialRoutes({ commit }, accessedRoutes) {
    commit("setPartialRoutes", accessedRoutes);
  },
};
export default { state, getters, mutations, actions };
