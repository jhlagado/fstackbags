import { Mode } from "./constants";

export type Elem = number | Tuple;
export type Tuple = [Elem, Elem, Elem, Elem] & {
    owner?: Owner,
    mask?: number,
    proc?: CProc | CSProc,
    name: string,
    destroy?: boolean,
};

export type Proc = (mode: Mode, d?: any) => Tuple | void;
export type CProc = (state: Tuple) => Proc;
export type CSProc = (state: Tuple) => (source: Tuple) => Tuple;

export type Effect = (value: string) => void;
export type Mapper = (value: any) => any;
export type Reducer = (acc: any, value: any) => any;

export type Owner = {
    container: Tuple;
    offset: number;
}

