export class Queue<T> {
  _store: T[] = [];

  push(val: T) {
    if (!this._store.includes(val)) this._store.push(val);
  }

  pop(): T | undefined {
    return this._store.shift();
  }

  length(): number {
    return this._store.length;
  }
}
