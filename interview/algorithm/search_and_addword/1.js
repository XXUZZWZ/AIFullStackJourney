// trie 字符串 dictionary
// { } map

const WordDictionary = function () {
  // 初始化一个对象字面量
  this.words = {};
};

WordDictionary.prototype.addWord = function (word) {
  if (this.words[word.length]) {
    this.words[word.length].push(word);
  } else {
    this.words[word.length] = [word];
  }
};

WordDictionary.prototype.search = function (word) {
  if (!this.words[word.length]) {
    return false;
  }
  const len = word.length;
  // 根据正则来搜
  if (!word.includes(".")) {
    return this.words[len].includes(word);
  }
  const reg = new RegExp(word);
  return this.words[len].some((item) => reg.test(item));
};
