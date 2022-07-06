import { getDatabase } from "./database";

class Node {
  children: { [key: string]: Node };
  last = false;
  constructor() {
    this.children = {};
  }
}

export default class Trie {
  private root: Node;
  constructor() {
    this.root = new Node();
  }

  insert(key: string | string[]) {
    if (Array.isArray(key)) {
      for (const k of key) {
        this.insert(k);
      }
    } else {
      let node = this.root;

      for (const char of key.split("")) {
        if (!(char in node.children)) {
          node.children[char] = new Node();
        }
        node = node.children[char];
      }
      node.last = true;
    }
  }

  private suggestionRec(node: Node, word: string, result: string[]) {
    if (node.last) {
      result.push(word);
    }
    for (const [c, n] of Object.entries(node.children)) {
      this.suggestionRec(n, word + c, result);
    }
  }

  getSuggestions(key: string): string[] {
    let node = this.root;
    const suggestions: string[] = [];

    for (const c of key.split("")) {
      if (!(c in node.children)) {
        return suggestions;
      }
      node = node.children[c];
    }

    if (Object.keys(node.children).length === 0) {
      return suggestions;
    }

    this.suggestionRec(node, key, suggestions);

    return suggestions;
  }
}
