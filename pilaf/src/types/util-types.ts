export type Await<T> = T extends Promise<infer U> ? U : T;
