import { Info } from "./Interfaces";

function swap(arr: Array<Info>, i: number, j: number) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function partition(
    arr: Array<Info>,
    start: number = 0,
    end: number = arr.length
) {
    let pivot: number = arr[start].ranking;
    let swapIndex: number = start;
    for (let i = start + 1; i < end; i++) {
        if (arr[i].ranking < pivot) {
            swapIndex++;
            swap(arr, i, swapIndex);
        }
    }
    swap(arr, start, swapIndex);
    return swapIndex;
}

export function QuickSort(
    arr: Array<Info>,
    start: number = 0,
    end: number = arr.length
): Array<Info> {
    if (start < end) {
        let p = partition(arr, start, end);
        QuickSort(arr, start, p - 1);
        QuickSort(arr, p + 1, end);
    }
    return arr;
}

function partitionBySeat(
    arr: Array<Info>,
    start: number = 0,
    end: number = arr.length
) {
    let pivot: number = arr[start].seat;
    let swapIndex: number = start;
    for (let i = start + 1; i < end; i++) {
        if (arr[i].seat < pivot) {
            swapIndex++;
            swap(arr, i, swapIndex);
        }
    }
    swap(arr, start, swapIndex);
    return swapIndex;
}

export function QuickSortBySeat(
    arr: Array<Info>,
    start: number = 0,
    end: number = arr.length
): Array<Info> {
    if (start < end) {
        let p = partitionBySeat(arr, start, end);
        QuickSortBySeat(arr, start, p - 1);
        QuickSortBySeat(arr, p + 1, end);
    }
    return arr;
}

