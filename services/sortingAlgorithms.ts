import { SortFunction, SortingAlgorithm } from '../types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to handle delay and cancellation
const step = async (
  checkCancel: () => boolean,
  getDelay: () => number
) => {
  if (checkCancel()) throw new Error("Cancelled");
  await sleep(getDelay());
};

export const bubbleSort: SortFunction = async (array, updateState, checkCancel, getDelay) => {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      await updateState({ compareIndices: [j, j + 1], swapIndices: [] });
      await step(checkCancel, getDelay);

      if (arr[j] > arr[j + 1]) {
        await updateState({ compareIndices: [j, j + 1], swapIndices: [j, j + 1] });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        await updateState({ array: [...arr] });
        await step(checkCancel, getDelay);
      }
    }
    // Mark end of array as sorted
    const sortedIndices = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);
    await updateState({ sortedIndices });
  }
  await updateState({ sortedIndices: arr.map((_, i) => i), compareIndices: [], swapIndices: [] });
};

export const selectionSort: SortFunction = async (array, updateState, checkCancel, getDelay) => {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      await updateState({ compareIndices: [minIdx, j], swapIndices: [], sortedIndices: Array.from({ length: i }, (_, k) => k) });
      await step(checkCancel, getDelay);
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      await updateState({ swapIndices: [i, minIdx] });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      await updateState({ array: [...arr] });
      await step(checkCancel, getDelay);
    }
  }
  await updateState({ sortedIndices: arr.map((_, i) => i), compareIndices: [], swapIndices: [] });
};

export const insertionSort: SortFunction = async (array, updateState, checkCancel, getDelay) => {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    
    await updateState({ compareIndices: [i, j], sortedIndices: [] }); 
    await step(checkCancel, getDelay);

    while (j >= 0 && arr[j] > key) {
      await updateState({ compareIndices: [j, j + 1], swapIndices: [j + 1] });
      arr[j + 1] = arr[j];
      await updateState({ array: [...arr] });
      await step(checkCancel, getDelay);
      j = j - 1;
    }
    arr[j + 1] = key;
    await updateState({ array: [...arr], swapIndices: [j + 1] });
    await step(checkCancel, getDelay);
  }
  await updateState({ sortedIndices: arr.map((_, i) => i), compareIndices: [], swapIndices: [] });
};

export const mergeSort: SortFunction = async (array, updateState, checkCancel, getDelay) => {
  const arr = [...array];
  
  const merge = async (left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
      await updateState({ compareIndices: [left + i, mid + 1 + j], swapIndices: [k] });
      await step(checkCancel, getDelay);

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      await updateState({ array: [...arr] });
      k++;
    }

    while (i < n1) {
      await updateState({ swapIndices: [k] });
      await step(checkCancel, getDelay);
      arr[k] = L[i];
      await updateState({ array: [...arr] });
      i++;
      k++;
    }

    while (j < n2) {
      await updateState({ swapIndices: [k] });
      await step(checkCancel, getDelay);
      arr[k] = R[j];
      await updateState({ array: [...arr] });
      j++;
      k++;
    }
  };

  const sort = async (l: number, r: number) => {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    await sort(l, m);
    await sort(m + 1, r);
    await merge(l, m, r);
  };

  await sort(0, arr.length - 1);
  await updateState({ sortedIndices: arr.map((_, i) => i), compareIndices: [], swapIndices: [] });
};

export const quickSort: SortFunction = async (array, updateState, checkCancel, getDelay) => {
  const arr = [...array];

  const partition = async (low: number, high: number) => {
    const pivot = arr[high];
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
      await updateState({ compareIndices: [j, high], swapIndices: [] });
      await step(checkCancel, getDelay);

      if (arr[j] < pivot) {
        i++;
        await updateState({ swapIndices: [i, j] });
        [arr[i], arr[j]] = [arr[j], arr[i]];
        await updateState({ array: [...arr] });
        await step(checkCancel, getDelay);
      }
    }
    await updateState({ swapIndices: [i + 1, high] });
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    await updateState({ array: [...arr] });
    await step(checkCancel, getDelay);
    return (i + 1);
  };

  const sort = async (low: number, high: number) => {
    if (low < high) {
      const pi = await partition(low, high);
      await sort(low, pi - 1);
      await sort(pi + 1, high);
    }
  };

  await sort(0, arr.length - 1);
  await updateState({ sortedIndices: arr.map((_, i) => i), compareIndices: [], swapIndices: [] });
};

export const heapSort: SortFunction = async (array, updateState, checkCancel, getDelay) => {
    const arr = [...array];
    const n = arr.length;

    const heapify = async (n: number, i: number) => {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < n) {
            await updateState({ compareIndices: [l, largest] });
            await step(checkCancel, getDelay);
            if (arr[l] > arr[largest]) largest = l;
        }

        if (r < n) {
            await updateState({ compareIndices: [r, largest] });
            await step(checkCancel, getDelay);
            if (arr[r] > arr[largest]) largest = r;
        }

        if (largest !== i) {
            await updateState({ swapIndices: [i, largest] });
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            await updateState({ array: [...arr] });
            await step(checkCancel, getDelay);
            await heapify(n, largest);
        }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        await updateState({ swapIndices: [0, i] });
        [arr[0], arr[i]] = [arr[i], arr[0]];
        await updateState({ array: [...arr] });
        await step(checkCancel, getDelay);
        await heapify(i, 0);
    }
    
    await updateState({ sortedIndices: arr.map((_, i) => i), compareIndices: [], swapIndices: [] });
};

export const getSorter = (algorithm: string): SortFunction => {
    switch (algorithm) {
        case SortingAlgorithm.BUBBLE: return bubbleSort;
        case SortingAlgorithm.SELECTION: return selectionSort;
        case SortingAlgorithm.INSERTION: return insertionSort;
        case SortingAlgorithm.MERGE: return mergeSort;
        case SortingAlgorithm.QUICK: return quickSort;
        case SortingAlgorithm.HEAP: return heapSort;
        default: return bubbleSort;
    }
}