import React from "react";
import avatar from "./images/avatar.webp";
import book from './images/books.webp'
import {
  add
}from './math'

export default function Hello() {
  return <div>
    <h1>Hello World 你好 老帝。。。。。</h1>
    <img src={avatar} alt="avatar" />
    <img src={book} alt="book" />
    <h1>{add(1, 2)}</h1>
  </div>;
}

/*
webpack 啥都要 loader
Compiled with problems:
×
ERROR in ./src/Hello.tsx 2:0-42
Module not found: Error: Can't resolve './images/avatar.webp' in 'C:\Users\HP\Desktop\AIFullStackJourney\interview\vite\deep-webpack\src'
ERROR in ./src/Hello.tsx 3:0-38
Module not found: Error: Can't resolve './images/book.webp' in 'C:\Users\HP\Desktop\AIFullStackJourney\interview\vite\deep-webpack\src'
*/