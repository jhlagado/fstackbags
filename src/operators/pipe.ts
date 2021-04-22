import { execClosureFactory } from '../utils/closure-utils';
import { Closure } from '../utils/types';

export const pipe = (source: Closure, ...sinks: Closure[]) => {
    let res = source;
    for (let i = 0, n = sinks.length; i < n; i++) {
        const closure = sinks[i];
        res = res ? execClosureFactory(closure, res) : res;
    }
    return res;
};
