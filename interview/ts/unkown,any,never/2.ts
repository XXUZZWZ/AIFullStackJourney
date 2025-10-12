let u: unknown;

u = 123;

u = 'world';

if (typeof u === 'string') {
  console.log(u.toUpperCase());
}

// u.toFixed(2); // 报错

// 要做类型收窄
if (typeof u === 'number') {
  u.toFixed(2);// 安全
}



console.log((u as number).toFixed(2));