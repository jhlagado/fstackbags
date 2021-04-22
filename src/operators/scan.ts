import { Mode } from '../utils/constants';
import { Closure, Tuple } from '../utils/types';
import { lookup } from '../utils/registry';
import { argsFactory, sinkFactory, execClosure, closureFactorySink } from '../utils/closure-utils';

const REDUCER = 0;
const SEED = 1;

const ACC = 1;

const scanTB = (state: Closure) => (mode: Mode, d: any) => {
    const args = state.args as Tuple;
    let vars = state.vars as Tuple;
    if (!vars) {
        vars = [args[SEED], 0, 0, 0];
        state.vars = vars;
    }
    const sink = state.sink as Closure;
    if (mode === Mode.data) {
        vars[ACC] = lookup(args[REDUCER] as number)(vars[ACC], d);
        execClosure(sink, Mode.data, vars[ACC]);
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
