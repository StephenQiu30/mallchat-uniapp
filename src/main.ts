import { createSSRApp } from "vue";
import App from "./App.vue";

// 引入 TDesign 基础样式
import '@tdesign/uniapp/theme.css';
// 引入全局样式
import './styles/index.css';

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
