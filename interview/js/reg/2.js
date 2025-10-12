var str = "abc345efgabcab";

var res = str.replace(/\d+/, function (math) {
  return `[${math}]`;
});

console.log(res);
