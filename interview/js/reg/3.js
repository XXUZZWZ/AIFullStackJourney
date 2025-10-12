var str = "abc345efgabcab";

var res = str.replace(/[\d]/g, function (match) {
  return parseInt(match) * 2;
});

console.log(res);
// abc6810efgabcab
