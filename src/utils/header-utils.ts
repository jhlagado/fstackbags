import { arrayNew, heapGetTupleIndex, here, mem } from "./heap-utils";

export let rcStart: number;
export let rcEnd: number;

const HEADER_START = 0;
const HEADER_OWNER = HEADER_START;
const HEADER_MASK = HEADER_OWNER + 4;
const HEADER_END = HEADER_MASK + 1;
const HEADER_BYTES = HEADER_END - HEADER_START;

export const headerBytes = (value: number) => value * HEADER_BYTES;

export const headersInit = (size: number) => {
    rcStart = arrayNew(headerBytes(size));
    rcEnd = here();
    for (let i = rcStart; i < rcEnd; i++) {
        mem.setInt32(rcStart, 0);
    }
}

export const getHeaderPtr = (ptr: number) => {
    const index = heapGetTupleIndex(ptr);
    return headerBytes(index);
}

export const getOwner = (ptr: number) => mem.getInt32(getHeaderPtr(ptr));
export const setOwner = (ptr: number, value: number) => mem.setInt32(getHeaderPtr(ptr), value);

export const getMask = (ptr: number) => mem.getInt8(getHeaderPtr(ptr) + HEADER_MASK);
export const setMask = (ptr: number, value: number) => mem.setInt8(getHeaderPtr(ptr) + HEADER_MASK, value);
