import RouterView from "./RouterView.vue";
import RouterLink from "./RouterLink.vue";
import {
  ref,
  inject, // 依赖注入
} from "vue";

const ROUTER_KEY = "__router__"; // key 存储路由实例

function createRouter(option) {
  return new Router(option);
}

function createWebHashHistory(option) {}

class Router {
  constructor(options) {
    this.routes = options.routes;
    
  }

  install(app) {
    app.provide(ROUTER_KEY, this);
    // console.log(app);
    app.component("router-link", RouterLink); // 组件名 ， 组件
    app.component("router-view", RouterView);
  }
}

function useRouter() {
  return inject(ROUTER_KEY);
}

export { createRouter, createWebHashHistory, useRouter };
