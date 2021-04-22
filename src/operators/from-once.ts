import { Mode } from '../utils/constants';
import { Closure } from '../utils/types';
import { argsFactory, closureFactorySource, execClosure } from '../utils/closure-utils';

const fromOnceTB = (state: Closure) => (mode: Mode, _d: any) => {
    const constant = state.args as number;
    const sink = state.sink as Closure;
    let taken = state.vars as number;
    if (mode === Mode.data && taken < 1) {
        state.vars = taken + 1;
        execClosure(sink, Mode.data, constant);
    }
    execClosure(sink, Mode.stop);
};

const sf = closureFactorySource(fromOnceTB);

export const fromOnce = argsFactory(sf);
