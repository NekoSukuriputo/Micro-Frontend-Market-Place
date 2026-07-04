import App from "./App.svelte";
import "./index.css";

export const mount = (el) => {
  const app = new App({ target: el });
  return () => app.$destroy();
};
