import { Mode } from '../utils/constants';
import { Closure } from '../utils/types';
import { lookup } from '../utils/registry';
import { argsFactory, execClosure, sinkFactoryTerminal } from '../utils/closure-utils';

const forEachTB = (state: Closure) => (mode: Mode, d: any) => {
    const effect = lookup(state.args as number) as Function;
    switch (mode) {
        case Mode.start:
            state.source = d;
            execClosure(d, Mode.data);
            break;
        case Mode.data:
            effect(d);
            const source = state.source as Closure;
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
