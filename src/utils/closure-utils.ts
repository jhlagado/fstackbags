import { CProc, CSProc, Tuple, Elem } from './types';
import { ARGS, SOURCE, Mode, VARS, SINK } from './constants';
import { tupleClone, tupleNew, tset } from './tuple-utils';

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

export const getInstance = (state: Tuple, sink: Tuple) => {
    const instance = [0, 0, 0, 0] as Tuple;
    tset(instance, ARGS, state[ARGS] as Tuple);
    tset(instance, VARS, state[VARS] as Tuple);
    tset(instance, SOURCE, state[SOURCE] as Tuple);
    tset(instance, SINK, sink);
    return instance;
};

export const getTB = (instance: Tuple, cproc: CProc) => {
    const tb = tupleClone(instance);
    tb.proc = cproc;
    return tb;
};

type CFF = (tb: Tuple, sink: Tuple) => void;
export const closureFactory = (f: CFF) => (cproc: CProc): CProc => (state: Tuple) => (mode: Mode, sink: Tuple) => {
    if (mode !== Mode.start) return;
    const instance = getInstance(state, sink);
    const tb = getTB(instance, cproc);
    f(tb, sink);
    return tb;
};

export const fSource = (tb: Tuple, sink: Tuple): void => {
    execClosure(sink, Mode.start, tb);
};

export const fSink = (tb: Tuple, _sink: Tuple): void => {
    const source = tb[SOURCE] as Tuple;
    execClosure(source, Mode.start, tb);
};

export const closureFactorySource = closureFactory(fSource);
export const closureFactorySink = closureFactory(fSink);
