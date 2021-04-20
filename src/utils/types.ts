import { Mode } from "./constants";

export type Elem = number | Tuple | Closure;
export type Tuple = [Elem, Elem, Elem, Elem];
export type Closure = [Tuple, CProc | CSProc]

export type Proc = (mode: Mode, d?: any) => Closure | void;
export type CProc = (state: Tuple) => Proc;
export type CSProc = (state: Tuple) => (source: Closure) => Closure;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export type Owner = {
    container: Tuple;
    offset: number;
}

