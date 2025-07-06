# html5 王者对象 Blog

- 图片转成 base64 编码的字符串。
- atob(base64)二进制字符串编码
- for 每个字符 charCodeAt() 转成十进制数字变成 0-255 整数(8byte)
- bytearray =new Uint8Array(byte.length) 创建一个字节数组，byteArray[i] = byte.charCodeAt(i)
- 二进制对象描述，new Blob (byteArray, {type: "image/png"})
- 二进制层面上去压缩，切割，修改，压缩，合并，解压，保存。
- URL.createObjectURL(blob) 创建一个 blob 对象的 URL 传递一个 blob 二进制对象，浏览器将临时访问地址
