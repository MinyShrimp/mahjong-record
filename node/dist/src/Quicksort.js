"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickSort = void 0;
function QuickSort(arr, start = 0, end = arr.length) {
    if (start < end) {
        let p = partition(arr, start, end);
        QuickSort(arr, start, p - 1);
        QuickSort(arr, p + 1, end);
    }
    return arr;
}
exports.QuickSort = QuickSort;
function partition(arr, start = 0, end = arr.length) {
    let pivot = arr[start].score;
    let swapIndex = start;
    for (let i = start + 1; i < end; i++) {
        if (arr[i].score > pivot) {
            swapIndex++;
            swap(arr, i, swapIndex);
        }
    }
    swap(arr, start, swapIndex);
    return swapIndex;
}
function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
