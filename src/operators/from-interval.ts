import { ARGS, Mode, SINK, SOURCE, VARS } from '../utils/constants';
import { Closure, CTuple, Tuple } from '../utils/types';
import { lookup, register } from '../utils/registry';
import { createClosure, argsFactory, execClosure } from '../utils/closure-utils';

const I = 1;
const ID = 2;

const callback = (state: Tuple) => () => {
    const vars = state[VARS] as Tuple;
    const i = vars[I] as number;
    const sink = state[SINK] as Closure;
    execClosure(sink, Mode.data, i);
    vars[I] = i + 1;
};

const talkback = (state: Tuple) => (mode: Mode) => {
    const vars = state[VARS] as Tuple;
    if (mode === Mode.stop) {
        clearInterval(lookup(vars[ID] as number));
    }
};

const sf = (state: CTuple) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const vars = [0, 0, 0, 0];
    const period = (state[ARGS] as Tuple)[0] as number;
    const instance: CTuple = [...state];
    instance[VARS] = vars;
    instance[SINK] = sink;
    vars[ID] = register(setInterval(callback(instance), period));
    const tb = createClosure([...instance], talkback);
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
