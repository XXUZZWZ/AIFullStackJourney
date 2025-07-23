export default [
  {
    url: "/api/todos",
    method: "get",
    response: () => {
      const todos = [
        { id: 1, title: "todo1", completed: false },
        { id: 2, title: "todo2", completed: true },
        { id: 3, title: "todo3", completed: false },
      ];
      return {
        code: 0,
        data: todos,
        message: "获取todos success",
        success: true,
      };
    },
  },
  {
    url: "/api/you",
    method: "get",
    response: () => {
      const res = "我是你爸爸";
      return {
        code: 200,
        data: res,
        message: "你知道了吗",
        success: true,
      };
    },
  },
  {
    url: "/repos",
    method: "get",
    response: () => {
      const repos = [
        {
          name: "react",
          description: "react is a javascript library",
        },
      ];
      // return {
      //   code: 200,
      //   data: repos,
      //   message: "success",
      //   success: true,
      // };
      return repos;
    },
  },
];
