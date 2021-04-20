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

