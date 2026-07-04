import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./index.css";

export const mount = (el: HTMLElement) => {
  const pinia = createPinia();
  const app = createApp(App);
  app.use(pinia);
  app.mount(el);
  return () => app.unmount();
};
