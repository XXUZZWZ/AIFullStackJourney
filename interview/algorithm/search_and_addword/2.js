class TrieNode {
  constructor() {
    this.children = new Map(); // key: 字母, value: TrieNode
    this.isEnd = false;
  }
}

class WordDictionary {
  constructor() {
    this.root = new TrieNode();
  }

  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  search(word) {
    const dfs = (idx, node) => {
      if (idx === word.length) return node.isEnd;
      const ch = word[idx];

      if (ch !== ".") {
        const next = node.children.get(ch);
        return next ? dfs(idx + 1, next) : false;
      }

      // ch === '.'
      for (const [, child] of node.children) {
        if (dfs(idx + 1, child)) return true;
      }
      return false;
    };

    return dfs(0, this.root);
  }
}
