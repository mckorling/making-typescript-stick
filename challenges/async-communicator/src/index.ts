import { expectType } from "tsd";

// IMPLEMENT THIS TYPE, want methods that return Promises
// can iterate over T, which points to needing a mapped type
// T is methods object constructed below, that's how we know to iterate
export type WrapForPenpal<T> = {
  // map over keys of T
  // check if the value is a method and pull the return value as R
  // check for catch all function is { (...arg: any): returnType }
  // infer Args uses a variadic tuple type
  [K in keyof T]: T[K] extends { (...arg: infer Args): infer R }
    ? R extends Promise<any>
      ? (...arg: Args) => R // R is already a promise, but still need it returned in a method
      : (...arg: Args) => Promise<R> // method that returns a Promise
    : never;
};

/**
 * Test Scenario - Do not change anything below this line
 */
const methods = {
  add(a: number, b: number): number {
    return a + b;
  },
  subtract(a: number, b: number): number {
    return a - b;
  },
  doAsyncThing(a: number, b: number): Promise<number> {
    return Promise.resolve(a - b);
  },
};
const asyncMethods: WrapForPenpal<typeof methods> = {} as any;

let addPromise = asyncMethods.add(1, 2);
expectType<Promise<number>>(addPromise);
// @ts-expect-error
expectType<typeof addPromise>("this should fail");

let subtractPromise = asyncMethods.subtract(1, 2);
expectType<Promise<number>>(subtractPromise);
// @ts-expect-error
expectType<typeof subtractPromise>("this should fail");

// Don't want a nested promise: <Promise<Promise<number>>
let asyncSubtractPromise = asyncMethods.doAsyncThing(1, 2);
expectType<Promise<number>>(asyncSubtractPromise);
// @ts-expect-error
expectType<typeof subtractPromise>("this should fail");
