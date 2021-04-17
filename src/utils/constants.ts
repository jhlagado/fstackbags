export const TUPLE_SIZE = 4;
export const ARGS = 0;
export const VARS = 1;
export const SOURCE = 2;
export const SINK = 3;

export const LAST = 3;
export const MEM_SIZE = 100000;
export const CELL_BYTES = 4;                        // size in bytes of a CELL
export const TUPLE_BYTES = TUPLE_SIZE * CELL_BYTES; // size in bytes of a tuple
export const NIL = -1; // needed because 0 is a valid address
export const FALSE = 0;
export const TRUE = -1;

export enum Mode {
    init = 3,
    start = 0,
    data = 1,
    stop = 2,
}

