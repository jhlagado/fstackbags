import { Tuple } from "./types";
import { CELL_BYTES, LAST, MEM_SIZE, NIL, TUPLE_BYTES } from "./constants";
import { headersInit } from "./header-utils";

export const buffer = new ArrayBuffer(MEM_SIZE);
export const mem = new DataView(buffer);
let herePtr = 0;

let heapPtr: number;
let freePtr: number;
export let heapStart: number;
export let heapEnd: number;

export const allot = (size: number) => {
    herePtr += size;
}

export const here = () => herePtr;

export const arrayNew = (size: number) => {
    const h = herePtr;
    allot(size);
    return h;
}

export const heapInit = (size: number) => {
    heapPtr = 0;
    freePtr = NIL;
    heapStart = arrayNew(TUPLE_BYTES * (size));
    heapEnd = herePtr;
    headersInit(size);
}

export const heapIsFull = () => {
    if (freePtr !== NIL) return false
    return (heapEnd <= heapPtr)
}

export const heapNew = (a: number, b: number, c: number, d: number): number => {
    if (heapIsFull()) throw new Error('Out of heap space');
    let tuplePtr: number;
    if (freePtr !== NIL) {
        tuplePtr = freePtr;
        freePtr = mem.getInt32(tuplePtr + CELL_BYTES * (LAST));
    }
    else {
        tuplePtr = heapPtr;
        heapPtr += TUPLE_BYTES;
    }
    heapSetTuple(tuplePtr, a, b, c, d);
    return tuplePtr;
};

export const heapFree = (tuplePtr: number) => {
    mem.setInt32(tuplePtr + CELL_BYTES * (LAST), freePtr);
    freePtr = tuplePtr;
}

export const heapGetTuple = (ptr: number): Tuple => {
    const tuple = [];
    tuple.push(mem.getInt32(ptr)); ptr += CELL_BYTES;
    tuple.push(mem.getInt32(ptr)); ptr += CELL_BYTES;
    tuple.push(mem.getInt32(ptr)); ptr += CELL_BYTES;
    tuple.push(mem.getInt32(ptr)); 
    return tuple as Tuple;
}

export const heapSetTuple = (ptr: number, a: number, b: number, c: number, d: number) => {
    mem.setInt32(ptr, a); ptr += CELL_BYTES;
    mem.setInt32(ptr, b); ptr += CELL_BYTES;
    mem.setInt32(ptr, c); ptr += CELL_BYTES;
    mem.setInt32(ptr, d); 
}

export const heapGetTupleIndex = (ptr: number) => (ptr - heapStart) / TUPLE_BYTES;
