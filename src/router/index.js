/**
 * @author knows 1002563923@qq.com
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标
 * hidden:true                    是否显示在菜单中显示路由（默认值：false）
 * alwaysShow:true                当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）
 * name:"Demo"                    首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制（该项特别重要）
 * meta:{
    title:"title"                 菜单、面包屑、多标签页显示的名称
    roles:["admin","..."]   当config/settings.js中rolesControl配置开启时，用于控制角色
    remixIcon:""                  remix图标
    noKeepAlive:true              当前路由是否不缓存（默认值：false）
    affix:true                    当前路由是否固定多标签页
    badge:"New"                   badge小标签（只支持子级）
    tagHidden:true                当前路由是否不显示多标签页
  }
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layouts";
import BlankLayout from "@/layouts/BlankLayout";
import { publicPath, routerMode } from "@/config/settings";
import weChatRouter from "./weChatRouter"; // 微信菜单

Vue.use(VueRouter);
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/403",
    name: "403",
    component: () => import("@/views/403"),
    hidden: true,
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404"),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    meta: {
      title: "首页",
      remixIcon: "home-4-line",
      affix: true,
    },
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("@/views/index"),
        meta: {
          title: "首页",
          remixIcon: "home-4-line",
          affix: true,
        },
      },
      {
        path: "/icon",
        name: "Icon",
        component: () => import("@/views/icon"),
        hidden: true,
        meta: {
          title: "图标列表",
        },
      },
    ],
  },
  {
    path: "/merchant",
    component: Layout,
    name: "Merchant",
    redirect: "/merchant/manage",
    meta: {
      title: "商户",
      remixIcon: "store-2-line",
      affix: true,
    },
    children: [
      {
        path: "manage",
        name: "MerchantManage",
        component: () => import("@/views/merchant"),
        meta: {
          title: "商户",
          remixIcon: "store-2-line",
          affix: true,
        },
      },
    ],
  },
  weChatRouter,
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

export function resetRouter() {
  store.commit("routes/resetIsInitRouter"); // 清除掉路由判断标志
  router.matcher = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher;
}

export default router;
