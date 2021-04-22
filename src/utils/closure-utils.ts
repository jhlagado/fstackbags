import { CProc, CSProc, Elem, Closure } from './types';
import { Mode } from './constants';

export const createClosure = (
    args: Elem,
    vars: Elem,
    source: Closure | null,
    sink: Closure | null,
    proc: CProc | CSProc,
): Closure => ({ args, vars, source, sink, proc });

export const execClosure = (closure: Closure, mode: Mode, d?: any) => (closure.proc as CProc)(closure)(mode, d);

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

export const argsFactory = (cproc: CProc | CSProc) => (...argList: Elem[]) =>
    createClosure(getArgs(argList), 0, null, null, cproc);

export const sinkFactory = (cproc: CProc): CSProc => ({ args }: Closure) => (source: Closure) =>
    createClosure(args, 0, source, null, cproc);

export const sinkFactoryTerminal = (cproc: CProc): CSProc => ({ args }: Closure) => (source: Closure) => {
    const tb = createClosure(args, 0, source, null, cproc);
    execClosure(source, Mode.start, tb);
    return tb;
};

export const closureFactorySource = (cproc: CProc): CProc => ({ args, vars, source }: Closure) => (
    mode: Mode,
    sink: Closure,
) => {
    if (mode !== Mode.start) return;
    const tb = createClosure(args, vars, source, sink, cproc);
    execClosure(sink, Mode.start, tb);
    return tb;
};

export const closureFactorySink = (cproc: CProc): CProc => ({ args, vars, source }: Closure) => (
    mode: Mode,
    sink: Closure,
) => {
    if (mode !== Mode.start) return;
    const tb = createClosure(args, vars, source, sink, cproc);
    execClosure(source as Closure, Mode.start, tb);
    return tb;
};
