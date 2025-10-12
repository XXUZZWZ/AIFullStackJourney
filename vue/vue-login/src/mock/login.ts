export default [
  {
    url: "/api/login",
    method: "post",
    response: (req) => {
      const { username, password } = req.body;
      if (username !== "admin" || password !== "123456") {
        return {
          code: 1,
          message: "用户名或密码错误",
        };
      }
      if (username === "admin" && password === "123456") {
        return {
          code: 200,
          message: "success",
          data: {
            token: "123456",
            username: "admin",
          },
        }
      }
      return {
        code: 400,
        message: "用户名或密码错误",
      };

    }
  }
]