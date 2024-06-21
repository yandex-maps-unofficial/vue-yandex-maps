export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export interface ClassType<T, P extends any[]> extends Function {
    new(...args: P): T;
}
