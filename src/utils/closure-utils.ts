import { CProc, CSProc, Tuple, Elem } from './types';
import { ARGS, SOURCE, Mode, VARS, SINK } from './constants';
import { elemClone, tupleClone, tupleDestroy, isOwned, tupleNew, tset } from './tuple-utils';

export const isTuple = (elem?: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const createClosure = (a: Elem, b: Elem, c: Elem, d: Elem, cproc: CProc | CSProc): Tuple => {
    const closure = tupleNew(a, b, c, d);
    closure.proc = cproc;
    closure.name = cproc.name;
    return closure;
};

export const cleanupClosure = (closure: Tuple) => {
    if (!isOwned(closure)) tupleDestroy(closure);
};

export const execClosure = (closure: Tuple, mode: Mode, d?: any) => {
    const proc = closure.proc as CProc;
    const result = proc(closure)(mode, d);
    cleanupClosure(closure);
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

export const argsFactory = (cproc: CProc | CSProc) => (...args: Elem[]) =>
    createClosure(elemClone(getArgs(args), true), 0, 0, 0, cproc);

export const sinkFactory = (cproc: CProc): CSProc => {
    const sinkFactoryProc = (state: Tuple) => (source: Tuple) => {
        const tb = createClosure(elemClone(state[ARGS], false), 0, elemClone(source, true), 0, cproc);
        cleanupClosure(source);
        return tb;
    };
    return sinkFactoryProc;
};

export const sinkFactoryTerminal = (cproc: CProc): CSProc => {
    const sinkFactoryProc = (state: Tuple) => (source: Tuple) => {
        const tb = createClosure(elemClone(state[ARGS], false), 0, elemClone(source, true), 0, cproc);
        execClosure(source, Mode.start, tb);
        return tb;
    };
    return sinkFactoryProc;
};

export const getInstance = (state: Tuple, sink: Tuple) => {
    const instance = [0, 0, 0, 0] as Tuple;
    tset(instance, ARGS, state[ARGS] as Tuple);
    tset(instance, VARS, state[VARS] as Tuple);
    tset(instance, SOURCE, state[SOURCE] as Tuple);
    tset(instance, SINK, sink);
    return instance;
};

export const getTB = (instance: Tuple, cproc: CProc) => {
    const tb = tupleClone(instance, false);
    tb.proc = cproc;
    tb.name = cproc.name;
    return tb;
};

type CFF = (instance: Tuple, tb: Tuple, sink: Tuple) => void;
export const closureFactory = (f: CFF) => (cproc: CProc): CProc => {
    const closureFactoryProc = (state: Tuple) => (mode: Mode, sink: Tuple) => {
        if (mode !== Mode.start) return;
        const instance = getInstance(state, sink);
        const tb = getTB(instance, cproc);
        f(instance, tb, sink);
        return tb;
    };
    return closureFactoryProc;
};

export const fSource = (instance: Tuple, tb: Tuple, sink: Tuple): void => {
    execClosure(sink, Mode.start, tb);
    tupleDestroy(instance);
};

export const fSink = (instance: Tuple, tb: Tuple, _sink: Tuple): void => {
    const source = tb[SOURCE] as Tuple;
    execClosure(source, Mode.start, tb);
    tupleDestroy(instance);
};

export const closureFactorySource = closureFactory(fSource);
export const closureFactorySink = closureFactory(fSink);
