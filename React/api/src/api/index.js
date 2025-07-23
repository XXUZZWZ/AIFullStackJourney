import axios from "./config";

export const getTodos = () => {
  return axios.get("/api/todos");
};
export const getRepos = () => {
  return axios.get("/repos");
};
