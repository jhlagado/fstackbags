import { Elem, Owner, Tuple } from './types';
import { isTuple } from './closure-utils';
import { formatTuple } from './format-utils';

export const tupleList: Tuple[] = [];

export const tupleNew = (a: Elem, b: Elem, c: Elem, d: Elem) => {
    const tuple = [0, 0, 0, 0] as Tuple;
    tset(tuple, 0, a);
    tset(tuple, 1, b);
    tset(tuple, 2, c);
    tset(tuple, 3, d);
    tupleList.push(tuple);
    return tuple;
};

export const ownerNew = (container: Tuple, offset: number) => ({ container, offset });

export const hasOwner = (elem: Elem): boolean => {
    const owner = getOwner(elem);
    if (!owner) return false;
    const { container, offset } = owner;
    const self = tget(container, offset);
    return elem === self;
};

export const getOwner = (elem: Elem): Owner | undefined => {
    if (!isTuple(elem)) return;
    if (!elem.owner) return;
    return elem.owner;
};

export const setOwner = (elem: Elem, owner: Owner | undefined) => {
    if (!isTuple(elem)) return;
    elem.owner = owner;
};

export const isOwned = (elem: Elem): elem is Tuple => {
    const owner = getOwner(elem);
    return isOwnedBy(elem, owner);
};

export const isOwnedBy = (elem: Elem, owner: Owner | undefined): elem is Tuple => {
    if (!owner) return false;
    const { container, offset } = owner;
    return tget(container, offset) === elem;
};

export const maskGet = (tuple: Tuple, offset: number): boolean => {
    let mask = tuple.mask || 0;
    const m = 1 << offset;
    const v = mask & 0xf & m;
    return v !== 0;
};

export const maskSet = (tuple: Tuple, offset: number, value: boolean) => {
    let mask = tuple.mask || 0;
    const m = ~(1 << offset);
    mask &= m;
    const b = (value ? 1 : 0) << offset;
    mask |= b;
    tuple.mask = mask;
};

export const tget = (tuple: Tuple, offset: number): Elem => {
    if (tuple.destroy) throw new Error('Tried to get field ' + offset + ' of destroyed tuple ' + formatTuple(tuple));
    return tuple[offset];
};

export const tgetv = (tuple: Tuple, offset: number): number => {
    return tget(tuple, offset) as number;
};

export const tsetv = (tuple: Tuple, offset: number, value: number) => {
    if (maskGet(tuple, offset)) {
        const elem0 = tget(tuple, offset);
        if (isOwnedBy(elem0, { container: tuple, offset })) {
            setOwner(elem0, undefined);
            tupleDestroy(elem0);
        }
    }
    tuple[offset] = value;
    maskSet(tuple, offset, false);
};

export const tset = (tuple: Tuple, offset: number, elem: Elem) => {
    if (tuple.destroy) throw new Error('Tried to set field of destroyed tuple ' + formatTuple(tuple));
    if (maskGet(tuple, offset)) {
        const elem0 = tget(tuple, offset);
        if (isOwnedBy(elem0, { container: tuple, offset })) {
            setOwner(elem0, undefined);
            tupleDestroy(elem0);
        }
    }
    const t = isTuple(elem);
    tuple[offset] = elem;
    maskSet(tuple, offset, t);
    if (!t) return;
    if (!hasOwner(elem)) {
        setOwner(elem, { container: tuple, offset });
    }
};

export const tupleDestroy = (tuple: Tuple) => {
    setOwner(tuple, undefined);
    for (let i = 0; i < 4; i++) {
        if (maskGet(tuple, i)) {
            const child = tget(tuple, i);
            const owner = getOwner(child);
            if (owner && owner.container === tuple && isOwnedBy(child, owner)) {
                tupleDestroy(child);
            }
        }
    }
    tuple.destroy = true;
};

export const tupleClone = (tuple: Tuple, deep: boolean): Tuple => {
    const tuple1 = tupleNew(0, 0, 0, 0);
    tuple1.proc = tuple.proc;
    for (let i = 0; i < 4; i++) {
        if (maskGet(tuple, i)) {
            const child = tget(tuple, i) as Tuple;
            const child1 = deep ? tupleClone(child, deep) : child;
            tset(tuple1, i, child1);
        } else {
            const child = tgetv(tuple, i);
            tsetv(tuple1, i, child);
        }
    }
    return tuple1;
};

export const elemClone = (elem: Elem, deep: boolean): Elem => {
    if (!isTuple(elem)) return elem;
    return tupleClone(elem, deep);
};
