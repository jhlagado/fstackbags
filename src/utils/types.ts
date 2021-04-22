import { Mode, NIL } from './constants';

export type Elem = null | number | Tuple | Closure;
export type Tuple = Elem[];
export type CTuple = [
    Tuple | number | typeof NIL,
    Tuple | number | typeof NIL,
    Closure | typeof NIL,
    Closure | typeof NIL,
];
export interface Closure {
    args: Elem;
    vars: Elem;
    source: Closure | null;
    sink: Closure | null;
    proc: CProc | CSProc;
}

export type Proc = (mode: Mode, d?: any) => Closure | void;
export type CProc = (state: Closure) => Proc;
export type CSProc = (state: Closure) => (source: Closure) => Closure;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export type Owner = {
    container: Tuple;
    offset: number;
};
