class MinHeap {
  constructor(compareFn) {
    this.data = [];
    this.compareFn = compareFn;
  }

  size() {
    return this.data.length;
  }

  push(value) {
    this.data.push(value);
    this._bubbleUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) {
      return null;
    }

    const first = this.data[0];
    const last = this.data.pop();

    if (this.data.length > 0) {
      this.data[0] = last;
      this._bubbleDown(0);
    }

    return first;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compareFn(this.data[index], this.data[parentIndex]) >= 0) {
        break;
      }
      this._swap(index, parentIndex);
      index = parentIndex;
    }
  }

  _bubbleDown(index) {
    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = leftIndex + 1;
      let smallestIndex = index;

      if (leftIndex < this.data.length && this.compareFn(this.data[leftIndex], this.data[smallestIndex]) < 0) {
        smallestIndex = leftIndex;
      }

      if (rightIndex < this.data.length && this.compareFn(this.data[rightIndex], this.data[smallestIndex]) < 0) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === index) {
        break;
      }

      this._swap(index, smallestIndex);
      index = smallestIndex;
    }
  }

  _swap(left, right) {
    const temp = this.data[left];
    this.data[left] = this.data[right];
    this.data[right] = temp;
  }
}

module.exports = MinHeap;
