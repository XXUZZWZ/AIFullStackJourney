import pkg from "jsonwebtoken";

const { sign, decode } = pkg;
// 服务端私钥
const secret = "jwt-demo-secret";
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
      const token = sign(
        {
          user: {
            id: "001",
            username: "admin",
          },
        },
        secret,
        { expiresIn: "86400" }
      );
      return {
        token,
        data: {
          id: "001",
          username: "admin",
        },
      };
    },
  },
  {
    url: "/api/user",
    method: "GET",
    response: (req) => {
      const authHeader = req.headers["authorization"].split(" ")[1];
      //console.log(authHeader);
      const token = authHeader;
      //console.log(token);
      if (!token) {
        return { code: 1, message: "未找到 token" };
      }

      try {
        // const decoded = `fsfsdsfd`
        // console.log(token);
        // const tokenn =
        //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMDAxIiwidXNlcm5hbWUiOiJhZG1pbiJ9LCJpYXQiOjE3NTMyNDQwMjYsImV4cCI6MTc1MzI0NDExMn0.WVEf6RkWnYHvaJL6T7Me1qFB2HXskN5hh4Gq38sxhU0";

        console.log(token);
        const data = decode(token);
        // console.log(jwt.decode);
        console.log(data, "AAA");

        return {
          code: 0,
          message: "获取用户信息成功",
          username: data.user.username,
        };
      } catch (err) {
        return { code: 1, message: "token验证失败", err };
      }
    },
  },
];
