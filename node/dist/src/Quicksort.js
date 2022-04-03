"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BubbleSort = exports.QuickSort = void 0;
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
function BubbleSort(arr) {
    var len = arr.length;
    for (var i = len - 1; i > 0; i--) {
        for (var j = 0; j < i; j++) {
            if (arr[i].score > arr[j].score) {
                swap(arr, i, j);
            }
        }
    }
    return arr;
}
exports.BubbleSort = BubbleSort;
