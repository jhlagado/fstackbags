import { FALSE, Mode, TRUE } from '../utils/constants';
import { Closure, Tuple } from '../utils/types';
import { lookup } from '../utils/registry';
import { argsFactory, execClosure, closureFactorySource } from '../utils/closure-utils';

const INLOOP = 0;
const GOT1 = 1;
const COMPLETED = 2;
const DONE = 3;

const loop = (state: Closure) => {
    const iterator = lookup(state.args as number) as any;
    const vars = state.vars as Tuple;
    vars[INLOOP] = TRUE;
    while (vars[GOT1] && !vars[COMPLETED]) {
        vars[GOT1] = FALSE;
        const res = iterator.next();
        const sink = state.sink as Closure;
        if (res.done) {
            vars[DONE] = TRUE;
            execClosure(sink, Mode.stop);
            break;
        } else {
            execClosure(sink, Mode.data, res.value);
        }
    }
    vars[INLOOP] = FALSE;
};

const fromIteratorSinkCB = (state: Closure) => (mode: Mode) => {
    let vars = state.vars as Tuple;
    if (!vars) {
        vars = [FALSE, FALSE, FALSE, FALSE];
        state.vars = vars;
    }
    if (vars[COMPLETED]) return;
    switch (mode) {
        case Mode.data:
            vars[GOT1] = TRUE;
            if (!vars[INLOOP] && !vars[DONE]) loop(state);
            break;
        case Mode.stop:
            vars[COMPLETED] = TRUE;
            break;
    }
};

const sf = closureFactorySource(fromIteratorSinkCB);

export const fromIterator = argsFactory(sf);

// const fromIter = iter => (start, sink) => {
//     if (start !== 0) return;
//     const iterator =
//         typeof Symbol !== 'undefined' && iter[Symbol.iterator]
//             ? iter[Symbol.iterator]()
//             : iter;
//     let inloop = false;
//     let got1 = false;
//     let completed = false;
//     let res;
//     function loop() {
//         inloop = true;
//         while (got1 && !completed) {
//             got1 = false;
//             res = iterator.next();
//             if (res.done) {
//                 sink(2);
//                 break;
//             }
//             else sink(1, res.value);
//         }
//         inloop = false;
//     }
//     sink(0, t => {
//         if (completed) return

//         if (t === 1) {
//             got1 = true;
//             if (!inloop && !(res && res.done)) loop();
//         } else if (t === 2) {
//             completed = true;
//         }
//     });
// };
