import { ARGS, Mode, SINK, VARS } from '../utils/constants';
import { Tuple } from '../utils/types';
import { lookup } from '../utils/registry';
import { argsFactory, sinkFactory, execClosure, closureFactorySink } from '../utils/closure-utils';
import { tgetv, tupleNew, tset, tget } from '../utils/tuple-utils';

const REDUCER = 0;
const SEED = 1;

const ACC = 1;

const scanTB = (state: Tuple) => (mode: Mode, d: any) => {
    const args = state[ARGS] as Tuple;
    let vars = state[VARS] as Tuple;
    if (!vars) {
        vars = tupleNew(tgetv(args, SEED), 0, 0, 0);
        tset(state, VARS, vars);
    }
    const sink = state[SINK] as Tuple;
    if (mode === Mode.data) {
        tset(vars, ACC, lookup(tgetv(args, REDUCER))(tget(vars, ACC), d));
        execClosure(sink, Mode.data, tget(vars, ACC));
    } else {
        execClosure(sink, mode, d);
    }
};

const cproc = closureFactorySink(scanTB);

const sf = sinkFactory(cproc);

export const scan = argsFactory(sf);

// function scan(reducer, seed) {
//     let hasAcc = arguments.length === 2;
//     return source => (start, sink) => {
//       if (start !== 0) return;
//       let acc = seed;
//       source(0, (t, d) => {
//         if (t === 1) {
//           acc = hasAcc ? reducer(acc, d) : ((hasAcc = true), d);
//           sink(1, acc);
//         } else sink(t, d);
//       });
//     };
//   }
