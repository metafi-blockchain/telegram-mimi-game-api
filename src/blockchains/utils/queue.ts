export class Queue<T> {
  private _store: Set<T> = new Set(); // Using Set to avoid duplicates and improve performance

  push(val: T) {
    this._store.add(val); // Set ensures only unique values are added
  }

  pop(): T | undefined {
    const firstValue = this._store.values().next().value; // Get the first inserted value
    if (firstValue !== undefined) {
      this._store.delete(firstValue); // Remove it from the Set
    }
    return firstValue;
  }

  length(): number {
    return this._store.size; // Set has a size property to get the length
  }
}