import { CProc, CSProc, Tuple, Elem } from './types';
import { ARGS, SOURCE, Mode, VARS } from './constants';
import { tupleClone, tupleNew } from './tuple-utils';

export const isTuple = (elem?: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const createClosure = (a: Elem, b: Elem, c: Elem, d: Elem, cproc: CProc | CSProc): Tuple => {
    const closure = tupleNew(a, b, c, d);
    closure.proc = cproc;
    return closure;
};

export const execClosure = (closure: Tuple, mode: Mode, d?: any) => {
    const proc = closure.proc as CProc;
    const result = proc(closure)(mode, d);
    return result;
};

export const getArgs = (args: Elem[]) => {
    switch (args.length) {
        case 0:
            return 0;
        case 1:
            return args[0];
        default:
            return tupleNew(args[0], args[1], args[2], args[3]);
    }
};

export const argsFactory = (cproc: CProc | CSProc) => (...args: Elem[]) => createClosure(getArgs(args), 0, 0, 0, cproc);

export const sinkFactory = (cproc: CProc): CSProc => {
    const sinkFactoryProc = (state: Tuple) => (source: Tuple) => {
        const tb = createClosure(state[ARGS], 0, source, 0, cproc);
        return tb;
    };
    return sinkFactoryProc;
};

export const sinkFactoryTerminal = (cproc: CProc): CSProc => {
    const sinkFactoryProc = (state: Tuple) => (source: Tuple) => {
        const tb = createClosure(state[ARGS], 0, source, 0, cproc);
        execClosure(source, Mode.start, tb);
        return tb;
    };
    return sinkFactoryProc;
};

export const getTB = (state: Tuple, sink: Tuple, cproc: CProc) => {
    const instance = [state[ARGS], state[VARS], state[SOURCE], sink];
    const tb = tupleClone(instance as Tuple);
    tb.proc = cproc;
    return tb;
};

export const closureFactorySource = (cproc: CProc): CProc => (state: Tuple) => (mode: Mode, sink: Tuple) => {
    if (mode !== Mode.start) return;
    const tb = getTB(state, sink, cproc);
    execClosure(sink, Mode.start, tb);
    return tb;
};

export const closureFactorySink = (cproc: CProc): CProc => (state: Tuple) => (mode: Mode, sink: Tuple) => {
    if (mode !== Mode.start) return;
    const tb = getTB(state, sink, cproc);
    const source = tb[SOURCE] as Tuple;
    execClosure(source, Mode.start, tb);
    return tb;
};
