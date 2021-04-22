import { Mode } from '../utils/constants';
import { Closure } from '../utils/types';
import { lookup } from '../utils/registry';
import { argsFactory, sinkFactory, execClosure, closureFactorySink } from '../utils/closure-utils';

const mapTB = (state: Closure) => (mode: Mode, d: any) => {
    const mapper = lookup(state.args as number) as Function;
    const sink = state.sink as Closure;
    execClosure(sink, mode, mode === Mode.data ? mapper(d) : d);
};

const cproc = closureFactorySink(mapTB);

const sf = sinkFactory(cproc);

export const map = argsFactory(sf);

// const map = f => source => (start, sink) => {
//     if (start !== 0) return;
//     source(0, (t, d) => {
//       sink(t, t === 1 ? f(d) : d)
//     });
//   };
