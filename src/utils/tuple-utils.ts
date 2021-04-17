import { Elem, Tuple } from './types';

export const tupleNew = (a: Elem, b: Elem, c: Elem, d: Elem) => {
    return [a, b, c, d] as Tuple;
};

export const tget = (tuple: Tuple, offset: number): Elem => {
    return tuple[offset];
};

export const tgetv = (tuple: Tuple, offset: number): number => {
    return tget(tuple, offset) as number;
};

export const tsetv = (tuple: Tuple, offset: number, value: number) => {
    tuple[offset] = value;
};

export const tset = (tuple: Tuple, offset: number, elem: Elem) => {
    tuple[offset] = elem;
};

export const tupleClone = (tuple: Tuple): Tuple => {
    const tuple1 = tupleNew(tuple[0], tuple[1], tuple[2], tuple[3]);
    tuple1.proc = tuple.proc;
    return tuple1;
};

