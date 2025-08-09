self.onmessage = async function (e) {
  const { imgData, quality } = e.data;
  // console.log(imgData, quality, "______________-----------------____________");
  try {
    //转成位图 将base64 -> bitmap
    // console.log(await fetch(imgData));
    // console.log(await fetch(imgData).blob());
    const bitmap = await createImageBitmap(await (await fetch(imgData)).blob());
    console.log(bitmap);
    // canvas 画布 可以在位图里取一些像素
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    // 在画之前得到画画的句柄 2d
    const ctx = canvas.getContext("2d");
    // 从左上角开始画
    ctx.drawImage(bitmap, 0, 0);
    // canvas ---> blob
    const compressedBlob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001,
    });
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result);
      self.postMessage({
        data: reader.result,
        success: true,
      });
    };
    reader.readAsDataURL(compressedBlob);
  } catch (error) {
    self.postMessage({
      error,
      success: false,
    });
  }
};
