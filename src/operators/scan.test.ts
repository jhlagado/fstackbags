import { forEach } from "./for-each";
import { fromIterator } from "./from-iterator";
import { register } from "../utils/registry";
import { pipe } from "./pipe";
import { scan } from "./scan";
import { printTuples } from "../utils/format-utils";

test('accumulate the total', () => {
    const expected = [1, 3, 6, 10];
    const expectedLength = expected.length;
    const crossCheck = (jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    }));
    const reducer = register((acc: number, value: number) => acc + value);
    const iterator = register([1, 2, 3, 4][Symbol.iterator]());

    pipe(
        fromIterator(iterator),
        scan(reducer, 0),
        forEach(register(crossCheck)),
    );
    expect(crossCheck).toHaveBeenCalledTimes(expectedLength);
    printTuples()
})