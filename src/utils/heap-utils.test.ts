import { TUPLE_BYTES } from "./constants";
import { heapEnd, heapInit, heapIsFull, heapStart, heapNew, heapFree, heapGetTuple } from "./heap-utils";

test('heap-utils', () => {
    heapInit(2);
    expect(heapEnd).toBe(TUPLE_BYTES * (2) + heapStart);
    expect(heapIsFull()).toBe(false);
    const t1 = heapNew(0,1,2,3);
    expect(heapIsFull()).toBe(false);
    const t2 = heapNew(4,5,6,7);
    expect(heapIsFull()).toBe(true);
    expect(heapGetTuple(t1)).toEqual([0,1,2,3]);
    expect(heapGetTuple(t2)).toEqual([4,5,6,7]);
    heapFree(t1);
    expect(heapIsFull()).toBe(false);
    const t3 = heapNew(8,9,10,11);
    expect(t3 === t1).toBeTruthy();
    expect(heapGetTuple(t2)).toEqual([4,5,6,7]);
    heapFree(t2);
    const t4 = heapNew(12,13,14,15);
    expect(t4 === t2).toBeTruthy();
    expect(heapGetTuple(t3)).toEqual([8,9,10,11]);
    expect(heapGetTuple(t4)).toEqual([12,13,14,15]);
})

/*
  2 heap4-init 
  heap4-end heap4-start - 2 TUPLE4-CELLS * 100 assert

  heap4-isfull false 100 assert

  0 0 0 0 heap4-new to t1
  heap4-ptr heap4-start - TUPLE4-CELLS 100 assert

  heap4-isfull false 100 assert

  0 0 0 0 heap4-new to t2
  heap4-isfull true 100 assert

  t1 heap4-free
  heap4-isfull false 100 assert

  0 0 0 0 heap4-new to t3
  heap4-isfull true 100 assert

  t1 t3 = true 100 assert

  t2 heap4-free
  heap4-isfull false 100 assert

  0 0 0 0 heap4-new to t4
  heap4-isfull true 100 assert

  t2 t4 = true 100 assert
  cr .s cr

*/