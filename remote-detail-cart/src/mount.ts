import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

export const mount = (el) => {
  const app = createApp(App);
  app.mount(el);
  return () => app.unmount();
};
