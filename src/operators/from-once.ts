import { ARGS, Mode, SINK, VARS } from '../utils/constants';
import { Closure, Tuple } from '../utils/types';
import { argsFactory, closureFactorySource, execClosure } from '../utils/closure-utils';
import { tset } from '../utils/tuple-utils';

const fromOnceTB = (state: Tuple) => (mode: Mode, _d: any) => {
    const constant = state[ARGS] as number;
    const sink = state[SINK] as Closure;
    let taken = state[VARS] as number;
    if (mode === Mode.data && taken < 1) {
        tset(state, VARS, taken + 1);
        execClosure(sink, Mode.data, constant);
    }
    execClosure(sink, Mode.stop);
};

const sf = closureFactorySource(fromOnceTB);

export const fromOnce = argsFactory(sf);
