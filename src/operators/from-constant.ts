import { Mode } from '../utils/constants';
import { Closure } from '../utils/types';
import { argsFactory, closureFactorySource, execClosure } from '../utils/closure-utils';

const fromConstantTB = (state: Closure) => (mode: Mode, d: any) => {
    const constant = state.args as number;
    const closure = state.sink as Closure;
    execClosure(closure, mode, mode === Mode.data ? constant : d);
};

const sf = closureFactorySource(fromConstantTB);

export const fromConstant = argsFactory(sf);
