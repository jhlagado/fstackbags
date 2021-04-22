import { ARGS, Mode, SINK, VARS } from '../utils/constants';
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
    const period = (state[ARGS] as Tuple)[0] as number;
    const ctuple: CTuple = [...state];
    const vars = [0, 0, register(setInterval(callback(ctuple), period)), 0];
    ctuple[VARS] = vars;
    ctuple[SINK] = sink;
    const tb = createClosure(ctuple, talkback);
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
