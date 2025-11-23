export enum SortingAlgorithm {
  BUBBLE = '冒泡排序 (Bubble Sort)',
  SELECTION = '选择排序 (Selection Sort)',
  INSERTION = '插入排序 (Insertion Sort)',
  MERGE = '归并排序 (Merge Sort)',
  QUICK = '快速排序 (Quick Sort)',
  HEAP = '堆排序 (Heap Sort)',
}

export interface VisualizerState {
  array: number[];
  compareIndices: number[]; // Indices currently being compared (Yellow)
  swapIndices: number[];    // Indices currently being swapped/overwritten (Red)
  sortedIndices: number[];  // Indices that are finalized (Green)
}

export interface AlgoInfo {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  javaCode: string;
}

export type SortFunction = (
  array: number[],
  updateState: (state: Partial<VisualizerState>) => Promise<void>,
  checkCancel: () => boolean,
  getDelay: () => number
) => Promise<void>;