class Queue {
  constructor() {
    this.items = [];
    this.front = 0;
    this.rear = 0;
  }

  isEmpty() {
    return this.front === this.rear;
  }

  push(item) {
    this.items[this.rear] = item;
    this.rear++;
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty.");
    }
    const removedElement = this.items[this.front];
    delete this.items[this.front];
    this.front++;
    return removedElement;
  }

  length() {
    return this.items.length;
  }
}

module.exports = { Queue };
