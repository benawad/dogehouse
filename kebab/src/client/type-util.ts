export type NormalObjectKey<T> = Exclude<T, symbol | number>;

export type DefaultValues<T, D> = {
  [K in keyof T]: D & T[K];
};

export type GroupMap<Group, Separator extends string, GroupName extends string> = {
  [RequestName in keyof Group as `${GroupName}${Separator}${NormalObjectKey<RequestName>}`]: Group[RequestName];
};

export type EmptyObject = Record<string | symbol | number, unknown>;
