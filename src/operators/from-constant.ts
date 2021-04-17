import { ARGS, Mode, SINK } from '../utils/constants';
import { Tuple } from '../utils/types';
import { argsFactory, closureFactorySource, execClosure } from '../utils/closure-utils';

const fromConstantTB = (state: Tuple) => (mode: Mode, d: any) => {
    const constant = state[ARGS] as number;
    const closure = state[SINK] as Tuple;
    execClosure(closure, mode, mode === Mode.data ? constant : d);
};

const sf = closureFactorySource(fromConstantTB);

export const fromConstant = argsFactory(sf);
