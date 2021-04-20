import { CProc, CSProc, Tuple, Elem, Closure, CTuple } from './types';
import { ARGS, SOURCE, Mode, VARS } from './constants';

export const createClosure = (ctuple: CTuple, cproc: CProc | CSProc): Closure => [ctuple, cproc] as Closure;

export const execClosure = (closure: Closure, mode: Mode, d?: any) => {
    const tuple: CTuple = closure[0];
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
            return [args[0], args[1], args[2], args[3]];
    }
};

export const argsFactory = (cproc: CProc | CSProc) => (...args: Elem[]) =>
    createClosure([getArgs(args), 0, 0, 0] as CTuple, cproc);

export const sinkFactory = (cproc: CProc): CSProc => (state: Tuple) => (source: Closure) => {
    const tb = createClosure([state[ARGS], 0, source, 0] as CTuple, cproc);
    return tb;
};

export const sinkFactoryTerminal = (cproc: CProc): CSProc => (state: Tuple) => (source: Closure) => {
    const tb = createClosure([state[ARGS], 0, source, 0] as CTuple, cproc);
    execClosure(source, Mode.start, tb);
    return tb;
};

export const closureFactorySource = (cproc: CProc): CProc => (state: Tuple) => (mode: Mode, sink: Closure) => {
    if (mode !== Mode.start) return;
    const tb = createClosure([state[ARGS], state[VARS], state[SOURCE], sink] as CTuple, cproc);
    execClosure(sink, Mode.start, tb);
    return tb;
};

export const closureFactorySink = (cproc: CProc): CProc => (state: Tuple) => (mode: Mode, sink: Closure) => {
    if (mode !== Mode.start) return;
    const source = state[SOURCE] as Closure;
    const tb = createClosure([state[ARGS], state[VARS], source, sink] as CTuple, cproc);
    execClosure(source, Mode.start, tb);
    return tb;
};
