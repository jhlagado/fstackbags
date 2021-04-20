import { CProc, CSProc, Tuple, Elem, Closure } from './types';
import { ARGS, SOURCE, Mode, VARS } from './constants';
import { tupleNew } from './tuple-utils';

export const isTuple = (elem?: Elem): elem is Tuple => Array.isArray(elem) && elem.length === 4;

export const createClosure = (a: Elem, b: Elem, c: Elem, d: Elem, cproc: CProc | CSProc): Closure =>
    [tupleNew(a, b, c, d), cproc] as Closure;

export const execClosure = (closure: Closure, mode: Mode, d?: any) => {
    const tuple = closure[0];
    const proc = closure[1] as CProc;
    const result = proc(tuple)(mode, d);
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
    const sinkFactoryProc = (state: Tuple) => (source: Closure) => {
        const tb = createClosure(state[ARGS], 0, source, 0, cproc);
        return tb;
    };
    return sinkFactoryProc;
};

export const sinkFactoryTerminal = (cproc: CProc): CSProc => {
    const sinkFactoryProc = (state: Tuple) => (source: Closure) => {
        const tb = createClosure(state[ARGS], 0, source, 0, cproc);
        execClosure(source, Mode.start, tb);
        return tb;
    };
    return sinkFactoryProc;
};

export const getTB = (state: Tuple, sink: Closure, cproc: CProc) =>
    createClosure(state[ARGS], state[VARS], state[SOURCE], sink, cproc);

export const closureFactorySource = (cproc: CProc): CProc => (state: Tuple) => (mode: Mode, sink: Closure) => {
    if (mode !== Mode.start) return;
    const tb = getTB(state, sink, cproc);
    execClosure(sink, Mode.start, tb);
    return tb;
};

export const closureFactorySink = (cproc: CProc): CProc => (state: Tuple) => (mode: Mode, sink: Closure) => {
    if (mode !== Mode.start) return;
    const tb = getTB(state, sink, cproc);
    const source = tb[0][SOURCE] as Closure;
    execClosure(source, Mode.start, tb);
    return tb;
};
