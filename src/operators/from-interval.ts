import { ARGS, Mode, SINK, VARS } from '../utils/constants';
import { Closure, Tuple } from '../utils/types';
import { lookup, register } from '../utils/registry';
import { createClosure, argsFactory, execClosure } from '../utils/closure-utils';
import { tset, tsetv, tgetv } from '../utils/tuple-utils';

const I = 1;
const ID = 2;

const callback = (state: Tuple) => () => {
    const vars = state[VARS] as Tuple;
    const i = tgetv(vars, I);
    const sink = state[SINK] as Closure;
    execClosure(sink, Mode.data, i);
    tsetv(vars, I, i + 1);
};

const talkback = (state: Tuple) => (mode: Mode) => {
    const vars = state[VARS] as Tuple;
    if (mode === Mode.stop) {
        clearInterval(lookup(tgetv(vars, ID)));
    }
};

const sf = (state: Tuple) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const period = tgetv(state[ARGS] as Tuple, 0);
    const instance: Tuple = [...state];
    tset(instance, SINK, sink);
    const vars: Tuple = [0, 0, 0, 0];
    tset(instance, VARS, vars);
    tsetv(vars, ID, register(setInterval(callback(instance), period)));
    const tb = createClosure(state[0], vars, state[2], sink, talkback);
    execClosure(sink, Mode.start, tb);
};

export const fromInterval = argsFactory(sf);

// const interval = period => (start, sink) => {
//     if (start !== 0) return;
//     let i = 0;
//     const id = setInterval(() => {
//         sink(1, i++);
//     }, period);
//     sink(0, t => {
//         if (t === 2) clearInterval(id);
//     });
// };
