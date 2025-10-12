function mynew(construst, ...args) {
  const obj = Object.create(construst.prototype);
  const result = construst.apply(obj, args);
  return result && typeof result === "object" && typeof result === "function"
    ? result
    : obj;
}
