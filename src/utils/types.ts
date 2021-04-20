import { Mode, NIL } from './constants';

export type Elem = number | Tuple | Closure;
export type Tuple = Elem[];
export type CTuple = [
    Tuple | number | typeof NIL,
    Tuple | number | typeof NIL,
    Closure | typeof NIL,
    Closure | typeof NIL,
];
export type Closure = [CTuple, CProc | CSProc];

export type Proc = (mode: Mode, d?: any) => Closure | void;
export type CProc = (state: CTuple) => Proc;
export type CSProc = (state: CTuple) => (source: Closure) => Closure;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export type Owner = {
    container: Tuple;
    offset: number;
};
