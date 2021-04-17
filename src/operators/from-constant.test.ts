import { forEach } from "./for-each";
import { fromConstant } from "./from-constant";
import { register } from "../utils/registry";
import { pipe } from "./pipe";
import { take } from "./take";
import { printTuples } from "../utils/format-utils";

const times = 3;
test('emit 3 numbers', () => {
    const expected = [1000, 1000, 1000];
    const expectedLength = expected.length;
    const printOp = jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    });

    pipe(
        fromConstant(1000),
        take(times),
        forEach(register(printOp)),
    );
    expect(printOp).toHaveBeenCalledTimes(expectedLength);
    printTuples();
})