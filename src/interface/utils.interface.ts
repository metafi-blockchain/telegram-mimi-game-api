interface IClassConstructor {
    new (...args: any[]): {};  // Input make sure class
}

interface IDaoBuildQuery{
    query: Object,
    total: Object
}

interface IEventSQSQueue{
    event: string,
    data: any
  }