export interface IBaseService<T>{

    create(u: T): Promise<T>

    update(cond: any, body: Object): Promise<T>

    delete(cond: any): Promise<any>

    total(cond: any):  Promise<number>

    findOne(cond: any): any

    findMany(cond: any, page: number, limit: number, sortBy: any, sort: number): any

    aggregate(cond: any): any

    findManyWithProjections(cond: any, projections: any, page: number, limit: number, sortBy: any, sort: number): any

    
}