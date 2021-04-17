import { ARGS, FALSE, Mode, SINK, TRUE, VARS } from '../utils/constants';
import { Tuple } from '../utils/types';
import { lookup } from '../utils/registry';
import { argsFactory, execClosure, closureFactorySource } from '../utils/closure-utils';
import { tgetv, tset, tsetv, tupleNew } from '../utils/tuple-utils';

const INLOOP = 0;
const GOT1 = 1;
const COMPLETED = 2;
const DONE = 3;

const loop = (state: Tuple) => {
    const iterator = lookup(state[ARGS] as number) as any;
    const vars = state[VARS] as Tuple;
    tsetv(vars, INLOOP, TRUE);
    while (tgetv(vars, GOT1) && !tgetv(vars, COMPLETED)) {
        tsetv(vars, GOT1, FALSE);
        const res = iterator.next();
        const sink = state[SINK] as Tuple;
        if (res.done) {
            tsetv(vars, DONE, TRUE);
            execClosure(sink, Mode.stop);
            break;
        } else {
            execClosure(sink, Mode.data, res.value);
        }
    }
    tsetv(vars, INLOOP, FALSE);
};

const fromIteratorSinkCB = (state: Tuple) => (mode: Mode) => {
    let vars = state[VARS] as Tuple;
    if (!vars) {
        vars = tupleNew(FALSE, FALSE, FALSE, FALSE);
        tset(state, VARS, vars);
    }
    if (tgetv(vars, COMPLETED)) return;
    switch (mode) {
        case Mode.data:
            tsetv(vars, GOT1, TRUE);
            if (!tgetv(vars, INLOOP) && !tgetv(vars, DONE)) loop(state);
            break;
        case Mode.stop:
            tsetv(vars, COMPLETED, TRUE);
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
