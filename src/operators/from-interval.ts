import { Mode } from '../utils/constants';
import { Closure, Tuple } from '../utils/types';
import { lookup, register } from '../utils/registry';
import { createClosure, argsFactory, execClosure } from '../utils/closure-utils';

const I = 1;
const ID = 2;

const callback = (state: Closure) => () => {
    const vars = state.vars as Tuple;
    const i = vars[I] as number;
    const sink = state.sink as Closure;
    execClosure(sink, Mode.data, i);
    vars[I] = i + 1;
};

const talkback = (state: Closure) => (mode: Mode) => {
    const vars = state.vars as Tuple;
    if (mode === Mode.stop) {
        clearInterval(lookup(vars[ID] as number));
    }
};

const sf = (state: Closure) => (mode: Mode, sink: any) => {
    if (mode !== Mode.start) return;
    const period = (state.args as Tuple)[0] as number;
    const c = { ...state };
    const vars = [0, 0, register(setInterval(callback(c), period)), 0];
    c.vars = vars;
    c.sink = sink;
    const tb = createClosure(c.args, c.vars, c.source, c.sink, talkback);
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
