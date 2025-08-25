import React from "react";
import Home from "./pages/Home";
import ReactDom from "react-dom/server";
import express from "express";

const app = express();
app.use(express.static("./public"));
app.get("/", (req, res) => {
  const componentHTML = ReactDom.renderToString(<Home />);
  console.log(componentHTML);
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSR</title>
  </head>
  <body>
  <div id="root">
   <h1>
    hello ssr
    ${ReactDom.renderToString(<Home />)}
   </h1>
  </div>
  </body>
  </html>
  `);
});

app.listen(8000);
console.log("Server running on http://localhost:8000");
