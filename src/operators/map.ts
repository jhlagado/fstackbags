import { ARGS, Mode, SINK } from '../utils/constants';
import { Tuple } from '../utils/types';
import { lookup } from '../utils/registry';
import { argsFactory, sinkFactory, execClosure, closureFactorySink } from '../utils/closure-utils';

const mapTB = (state: Tuple) => (mode: Mode, d: any) => {
    const mapper = lookup(state[ARGS] as number) as Function;
    const sink = state[SINK] as Tuple;
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
