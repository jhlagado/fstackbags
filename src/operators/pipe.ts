import { CSProc, Closure } from "../utils/types";

export const pipe = (source: Closure, ...sinks: Closure[]) => {
    let res = source;
    for (let i = 0, n = sinks.length; i < n; i++) {
        const closure = sinks[i];
        const proc = closure[1] as CSProc;
        res = res ? (proc(closure[0]))(res) : res;
    }
    return res;
}