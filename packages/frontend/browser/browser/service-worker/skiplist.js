class SkipListNode {
  constructor(value) {
      this.value = value;       // 节点值
      this.next = [];           // 每层的下一个节点（数组）
      this.level = 0;           // 当前节点的高度（从 0 开始）
  }
}

class SkipList {
  constructor() {
      this.head = new SkipListNode(-Infinity); // 头节点，值最小
      this.maxLevel = 0;                       // 当前最大层数
      this.levelProbability = 0.5;             // 随机升层的概率
  }

  // 随机生成层数
  randomLevel() {
      let level = 0;
      while (Math.random() < this.levelProbability && level < 16) { // 限制最大层数
          level++;
      }
      return level;
  }

  // 插入值
  insert(value) {
      const newNode = new SkipListNode(value);
      const newLevel = this.randomLevel(); // 新节点的层数
      if (newLevel > this.maxLevel) {
          this.maxLevel = newLevel;        // 更新最大层数
      }

      // 每层的前驱节点
      let current = this.head;
      const update = Array.from({length:this.maxLevel + 1}).fill(null);

      // 从顶层往下找插入位置
      for (let i = this.maxLevel; i >= 0; i--) {
          while (current.next[i] && current.next[i].value < value) {
              current = current.next[i];
          }
          update[i] = current; // 记录每层的前驱
      }

      // 设置新节点的层数
      newNode.level = newLevel;
      for (let i = 0; i <= newLevel; i++) {
          newNode.next[i] = update[i].next[i]; // 新节点指向前驱的下一个
          update[i].next[i] = newNode;         // 前驱指向新节点
      }
  }

  // 查找值
  search(value) {
      let current = this.head;
      for (let i = this.maxLevel; i >= 0; i--) {
          while (current.next[i] && current.next[i].value < value) {
              current = current.next[i];
          }
      }
      // 到最底层，检查是否等于目标值
      current = current.next[0];
      return current && current.value === value ? current : null;
  }

  // 删除值
  delete(value) {
      let current = this.head;
      const update = Array.from({length: this.maxLevel + 1}).fill(null);

      // 找前驱
      for (let i = this.maxLevel; i >= 0; i--) {
          while (current.next[i] && current.next[i].value < value) {
              current = current.next[i];
          }
          update[i] = current;
      }

      current = current.next[0];
      if (current && current.value === value) {
          // 删掉每层的连接
          for (let i = 0; i <= current.level; i++) {
              update[i].next[i] = current.next[i];
          }
          // 更新最大层数
          while (this.maxLevel > 0 && !this.head.next[this.maxLevel]) {
              this.maxLevel--;
          }
      }
  }

  // 打印（调试用）
  print() {
      for (let i = this.maxLevel; i >= 0; i--) {
          let str = `Level ${i}: `;
          let current = this.head.next[i];
          while (current) {
              str += `${current.value} -> `;
              current = current.next[i];
          }
          console.log(str + 'null');
      }
  }
}

// 测试
const sl = new SkipList();
sl.insert(3);
sl.insert(6);
sl.insert(1);
sl.insert(9);
sl.print();

console.log('找 6:', sl.search(6)?.value); // 6
sl.delete(6);
sl.print();
