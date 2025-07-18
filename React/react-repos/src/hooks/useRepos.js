import { useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { getRepos } from "../api/repos";

// 将逻辑抽离到自定义 Hook 中
export const useRepos = (id) => {
  const { state, dispatch } = useContext(GlobalContext);
  // 这里的状态生命周期问题，比如 这个state是一直存在
  useEffect(() => {
    console.log("|||||", id, "||||||");
    // getRepos(id).then((res) => {
    //   dispatch({ type: "FETCH_SUCCESS", payload: res });
    // });
    (async () => {
      try {
        dispatch({ type: "FETCH_START" });
        const res = await getRepos(id);
        console.log("FETCH_START");
        dispatch({ type: "FETCH_SUCCESS", payload: res });
        console.log("FETCH_SUCCESS|||res|||", res);
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err });
      }
    })();
  }, []);

  return state;
};
