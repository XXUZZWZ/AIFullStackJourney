## Blob 对象及 Base64 转换指南

### 一、Blob 对象详解

#### 核心概念

**Blob（Binary Large Object）** 是 JavaScript 处理二进制数据的核心对象：

- **不可变性**：创建后内容不可修改（可通过切片创建新 Blob）
- **类型标识**：通过 MIME 类型（如`image/png`）描述数据格式
- **大文件支持**：专为处理浏览器中的大型二进制数据设计

#### 主要应用场景

1. **文件操作**：`<input type="file">`获取的 File 对象继承自 Blob

   ```javascript
   document.querySelector("input").addEventListener("change", (e) => {
     const file = e.target.files[0]; // File继承自Blob
     console.log(file.size); // 文件大小
   });
   ```

2. **动态文件下载**

   ```javascript
   const blob = new Blob(["Hello, World!"], { type: "text/plain" });
   const url = URL.createObjectURL(blob);

   const a = document.createElement("a");
   a.href = url;
   a.download = "file.txt";
   a.click();

   URL.revokeObjectURL(url); // 释放内存
   ```

3. **分片上传**

   ```javascript
   async function upload(file) {
     const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
     for (let start = 0; start < file.size; start += CHUNK_SIZE) {
       const chunk = file.slice(start, start + CHUNK_SIZE);
       await fetch("/upload", { method: "POST", body: chunk });
     }
   }
   ```

4. **媒体预览**
   ```javascript
   const img = document.getElementById("preview");
   img.src = URL.createObjectURL(file);
   ```

### 二、关键 API

#### 构造函数

`new Blob(array, options)`

- `array`：数据源数组（ArrayBuffer/String/Blob）
- `options`：
  - `type`：MIME 类型（默认`""`）

#### 实例方法

```javascript
blob.size; // 字节大小
blob.type; // MIME类型
blob.slice(); // 分割Blob
blob.stream(); // 返回ReadableStream
blob.arrayBuffer(); // 转为ArrayBuffer（异步）
blob.text(); // 转为文本（异步）
```

### 三、Base64 转 Blob 实践

#### 转换函数实现

```javascript
function base64ToBlobUrl(base64Data, mimeType) {
  // 1. Base64解码
  const byteChars = atob(base64Data);

  // 2. 创建二进制数组
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i);
  }

  // 3. 创建Blob并生成URL
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
}
```

#### 使用示例

```javascript
// 音频播放
const audioUrl = base64ToBlobUrl(base64Data, "audio/mpeg");
const audio = new Audio(audioUrl);
audio.play();

// 图片预览
const img = document.createElement("img");
img.src = base64ToBlobUrl(base64Image, "image/jpeg");
document.body.appendChild(img);
```

#### 五大核心优势

1. **内存优化**：避免 Base64 的 33%体积膨胀
2. **流式处理**：支持边加载边播放
3. **安全合规**：规避 CSP 对`data:`协议的限制
4. **隐私保护**：敏感数据无需网络传输
5. **性能提升**：本地转换减少服务器压力

### 四、关键注意事项

1. **内存管理**：及时释放资源

   ```javascript
   const url = base64ToBlobUrl(data, "audio/mp3");
   audio.src = url;

   // 播放结束后释放
   audio.onended = () => URL.revokeObjectURL(url);
   ```

2. **MIME 类型对照表**
   | 实际格式 | 正确 MIME 类型 |
   |----------|-------------|
   | MP3 | `audio/mpeg` |
   | WAV | `audio/wav` |
   | PNG | `image/png` |
   | JPEG | `image/jpeg` |

3. **大文件处理优化**
   ```javascript
   function chunkedBase64ToBlob(base64Data, mimeType, chunkSize = 1_000_000) {
     const chunks = [];
     for (let i = 0; i < base64Data.length; i += chunkSize) {
       const chunk = base64Data.slice(i, i + chunkSize);
       const byteChars = atob(chunk);
       const byteArray = new Uint8Array(byteChars.length);
       for (let j = 0; j < byteChars.length; j++) {
         byteArray[j] = byteChars.charCodeAt(j);
       }
       chunks.push(byteArray);
     }
     return URL.createObjectURL(new Blob(chunks, { type: mimeType }));
   }
   ```

### 五、实际应用场景

#### 语音消息处理

```javascript
// 接收Base64语音
socket.on("voice-message", (data) => {
  const audio = new Audio(base64ToBlobUrl(data, "audio/webm"));

  // 播放后自动清理
  audio.onended = () => {
    URL.revokeObjectURL(audio.src);
    audio.remove();
  };

  document.body.appendChild(audio);
  audio.play();
});
```

#### Canvas 图像导出

```javascript
// Canvas转Blob预览
canvas.toBlob((blob) => {
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  img.onload = () => URL.revokeObjectURL(img.src);
  document.body.appendChild(img);
}, "image/png");
```

### 六、浏览器兼容方案

```javascript
// 旧浏览器兼容处理
if (typeof atob === "undefined") {
  window.atob = function (encoded) {
    return Buffer.from(encoded, "base64").toString("binary");
  };
}

if (!URL.createObjectURL) {
  URL.createObjectURL = function (blob) {
    return `data:${blob.type};base64,${btoa(
      new Uint8Array(blob).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )}`;
  };
}
```

> **最佳实践**：Blob 对象是浏览器端处理二进制数据的基石，结合 Base64 转换技术，可在保证性能的前提下实现丰富的文件操作功能。关键要掌握内存管理、类型匹配和分块处理三大核心技巧。
