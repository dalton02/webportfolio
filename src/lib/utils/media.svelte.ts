import { MediaQuery } from "svelte/reactivity";

class Query {
  lg = new MediaQuery("min-width: 1024px");
  md = new MediaQuery("min-width: 800px");
  xl = new MediaQuery("min-width: 1280px");
}

const mediaQuery = new Query();
export default mediaQuery;
