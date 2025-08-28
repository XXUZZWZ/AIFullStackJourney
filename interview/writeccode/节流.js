function throttle(fn, delay) {
  let invakeTime = Date.now();

  return function (...args) {
    let currentTime = Date.now();
    if (currentTime - invakeTime >= delay) {
      fn.apply(this, args);
      invakeTime = currentTime;
    }
  };
}

