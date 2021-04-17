import { forEach } from "./for-each";
import { fromIterator } from "./from-iterator";
import { map } from "./map";
import { register } from "../utils/registry";
import { pipe } from "./pipe";
import { printTuples } from "../utils/format-utils";

test('make count up to 40 and print each number', () => {
    const expected = [11, 21, 31, 41];
    const expectedLength = expected.length;
    const crossCheck = (jest.fn((value: string) => {
        console.log(value);
        expect(value).toBe(expected.shift());
    }));

    const iterator = register([10, 20, 30, 40][Symbol.iterator]());

    pipe(
        fromIterator(iterator),
        map(register((value: number) => value + 1)),
        forEach(register(crossCheck)),
    );
    expect(crossCheck).toHaveBeenCalledTimes(expectedLength);
    printTuples();

})