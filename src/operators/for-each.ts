import { ARGS, Mode, SOURCE } from '../utils/constants';
import { Tuple } from '../utils/types';
import { lookup } from '../utils/registry';
import { argsFactory, execClosure, sinkFactoryTerminal } from '../utils/closure-utils';
import { tset } from '../utils/tuple-utils';

const forEachTB = (state: Tuple) => (mode: Mode, d: any) => {
    const effect = lookup(state[ARGS] as number) as Function;
    switch (mode) {
        case Mode.start:
            tset(state, SOURCE, d);
            execClosure(d, Mode.data);
            break;
        case Mode.data:
            effect(d);
            const source = state[SOURCE] as Tuple;
            execClosure(source, Mode.data);
            break;
    }
};

const sf = sinkFactoryTerminal(forEachTB);

export const forEach = argsFactory(sf);

// const forEach = operation => source => {
//     let talkback;
//     source(0, (t, d) => {
//       if (t === 0) talkback = d;
//       if (t === 1) operation(d);
//       if (t === 1 || t === 0) talkback(1);
//     });
//   };
