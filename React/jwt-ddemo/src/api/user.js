import axios from "./config";

export const getUser = () => {
  return axios.get(`/user`);
};

export const doLogin = ({ username, password }) => {
  return axios.post("/login", { username, password });
};

// export const getUserArticles = ()=>{
//   return axios.get('/user/articles')
// }
