import { forEach } from "./for-each";
import { register } from "../utils/registry";
import { pipe } from "./pipe";
import { printTuples } from "../utils/format-utils";
import { fromOnce } from "./from-once";

test('emit 1 numbers', () => {
    const expected = [1000];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });

    pipe(
        fromOnce(1000),
        forEach(register(printOp)),
    );
    expect(printOp).toHaveBeenCalledTimes(expectedLength);
    printTuples();
})