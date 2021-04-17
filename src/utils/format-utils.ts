import { isTuple } from "./closure-utils";
import { TUPLE_SIZE } from "./constants";
import { maskGet, tupleList } from "./tuple-utils";
import { Elem, Tuple } from "./types";

let indent = '';

export const format = (elem?: Elem) => isTuple(elem) ? formatTuple(elem) : String(elem);

export const formatTuple = (tuple: Tuple, depth = 0) => {
    let s = '';
    // if (depth < 2) {
        s += (tuple.owner) ? tupleName(tuple.owner.container) : 'unowned';
        s += ' => ';
    // }
    s += tuple.destroy ? '*' : '';
    if (tuple.name) {
        s += tupleName(tuple) + ' ';
    }
    if (depth < 2 || !tuple.name) {
        const mask = tuple.mask || 0;
        const nested = mask > 0;
        s += '(';
        if (nested) { s += '\n'; indent += '    ' }
        for (let i = 0; i < TUPLE_SIZE; i++) {
            const m = maskGet(tuple, i)
            const elem = tuple[i];
            s += (nested) ? indent : ' ';
            s += (m) ? formatTuple(elem as Tuple, depth + 1) : String(elem);
            if (nested) { s += '\n'; }
        }
        if (nested) {
            indent = indent.slice(0, -4);
            s += indent;
        } else {
            s += ' ';
        }
        s += ')\n';
    }
    return s;
}

export const tupleName = (tuple: Tuple) => {
    return tuple.name || 'anonymous'
}

export const printTuple = (tuple: Tuple) => {
    console.log(format(tuple));
}

export const printTuples = () => {
    let s = '';
    for (const tuple of tupleList) {
        s += format(tuple);
    };
    console.log(s);
}
