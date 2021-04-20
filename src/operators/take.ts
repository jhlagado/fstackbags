import { ARGS, Mode, SINK, SOURCE, TRUE, VARS } from '../utils/constants';
import { Closure, CProc, Tuple } from '../utils/types';
import { createClosure, sinkFactory, argsFactory, execClosure, closureFactorySink } from '../utils/closure-utils';
import { tget, tset } from '../utils/tuple-utils';

const TAKEN = 1;
const END = 2;

const tbf: CProc = (state) => (mode, d) => {
    const max = state[ARGS] as number;
    const vars = state[VARS] as Tuple;
    const source = state[SOURCE] as Closure;
    if (mode === Mode.stop) {
        tset(vars, END, TRUE);
        execClosure(source, mode, d);
    } else if (tget(vars, TAKEN) < max) {
        execClosure(source, mode, d);
    }
};

const sourceTBF: CProc = (state) => (mode, d) => {
    const max = state[ARGS] as number;
    let vars = state[VARS] as Tuple;
    if (!vars) {
        vars = [0, 0, 0, 0];
        tset(state, VARS, vars);
    }
    const sink = state[SINK] as Closure;
    switch (mode) {
        case Mode.start:
            tset(state, SOURCE, d);
            execClosure(sink, Mode.start, createClosure(state[0], state[1], state[2], state[3], tbf));
            break;
        case Mode.data:
            const taken = tget(vars, TAKEN) as number;
            if (taken < max) {
                tset(vars, TAKEN, taken + 1);
                execClosure(sink, Mode.data, d);
                execClosure(sink, Mode.stop);
                if (tget(vars, TAKEN) === max && !tget(vars, END)) {
                    tset(vars, END, TRUE);
                    const source = state[SOURCE] as Closure;
                    if (source) execClosure(source, Mode.stop);
                    execClosure(sink, Mode.stop);
                }
            }

            break;
        case Mode.stop:
            execClosure(sink, Mode.stop, d);
            break;
    }
};

const cproc = closureFactorySink(sourceTBF);

const sf = sinkFactory(cproc);

export const take = argsFactory(sf);

// const take = max => source => (start, sink) => {
//     if (start !== 0) return;
//     let taken = 0;
//     let sourceTalkback;
//     let end;
//     function talkback(t, d) {
//         if (t === 2) {
//             end = true;
//             sourceTalkback(t, d);
//         } else if (taken < max) sourceTalkback(t, d);
//     }
//     source(0, (t, d) => {
//         if (t === 0) {
//             sourceTalkback = d;
//             sink(0, talkback);
//         } else if (t === 1) {
//             if (taken < max) {
//                 taken++;
//                 sink(t, d);
//                 if (taken === max && !end) {
//                     end = true
//                     sourceTalkback(2);
//                     sink(2);
//                 }
//             }
//         } else {
//             sink(t, d);
//         }
//     });
// };
