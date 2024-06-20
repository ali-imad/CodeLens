export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

const twoSumTestCases = [
  { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
  { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
  { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
  { input: { nums: [1, 2, 3, 4, 5], target: 8 }, expectedOutput: [2, 4] },
  { input: { nums: [1, 5, 5, 2], target: 10 }, expectedOutput: [1, 2] },
];

const findMedianSortedArraysTestCases = [
  { input: { nums1: [1, 3], nums2: [2] }, expectedOutput: 2.0 },
  { input: { nums1: [1, 2], nums2: [3, 4] }, expectedOutput: 2.5 },
  { input: { nums1: [0, 0], nums2: [0, 0] }, expectedOutput: 0.0 },
  { input: { nums1: [], nums2: [1] }, expectedOutput: 1.0 },
  { input: { nums1: [2], nums2: [] }, expectedOutput: 2.0 },
];

const isPalindromeTestCases = [
  { input: "A man, a plan, a canal: Panama", expectedOutput: true },
  { input: "race a car", expectedOutput: false },
  { input: " ", expectedOutput: true },
  { input: "0P", expectedOutput: false },
  { input: "madam", expectedOutput: true },
];

const deepEqualTestCases = [
  {
    input: { a: { name: "Alice" }, b: { name: "Alice" } },
    expectedOutput: true,
  },
  {
    input: { a: { name: "Alice" }, b: { name: "Bob" } },
    expectedOutput: false,
  },
  { input: { a: [1, 2, 3], b: [1, 2, 3] }, expectedOutput: true },
  { input: { a: [1, 2, 3], b: [3, 2, 1] }, expectedOutput: false },
  {
    input: { a: { name: "Alice", age: 25 }, b: { name: "Alice", age: 25 } },
    expectedOutput: true,
  },
];
const maxAreaTestCases = [
  { input: [1, 8, 6, 2, 5, 4, 8, 3, 7], expectedOutput: 49 },
  { input: [1, 1], expectedOutput: 1 },
  { input: [4, 3, 2, 1, 4], expectedOutput: 16 },
  { input: [1, 2, 1], expectedOutput: 2 },
  { input: [2, 3, 10, 5, 7, 8, 9], expectedOutput: 36 },
];
const isNumberTestCases = [
  { input: 123, expectedOutput: true },
  { input: "123", expectedOutput: false },
  { input: Infinity, expectedOutput: false },
  { input: -123.45, expectedOutput: true },
  { input: NaN, expectedOutput: false },
];

const reverseStringTestCases = [
  { input: "hello", expectedOutput: "olleh" },
  { input: "world", expectedOutput: "dlrow" },
  { input: "12345", expectedOutput: "54321" },
  { input: "racecar", expectedOutput: "racecar" },
  { input: "", expectedOutput: "" },
];

const mockProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: Difficulty.Easy,
    functionBody: `
function twoSum(nums: number[], target: number): number[] {
  const map: { [key: number]: number } = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in map) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
  throw new Error("No two sum solution");
}
    `,
    testCases: twoSumTestCases,
  },
  {
    id: 2,
    title: "Palindrome Check",
    difficulty: Difficulty.Easy,
    functionBody: `
function isPalindrome(s: string): boolean {
  const cleaned = s.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  return cleaned === cleaned.split('').reverse().join('');
}
    `,
    testCases: isPalindromeTestCases,
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: Difficulty.Hard,
    functionBody: `
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  const mergedArray = nums1.concat(nums2).sort((a, b) => a - b);
  const n = mergedArray.length;
  return n % 2 !== 0 ? mergedArray[Math.floor(n / 2)] : (mergedArray[n / 2 - 1] + mergedArray[n / 2]) / 2;
}
    `,
    testCases: findMedianSortedArraysTestCases,
  },
  {
    id: 4,
    title: "Deep Comparison",
    difficulty: Difficulty.Medium,
    functionBody: `
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || typeof a != "object" || b == null || typeof b != "object") return false;
  
  let keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length != keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}
    `,
    testCases: deepEqualTestCases,
  },
  {
    id: 5,
    title: "Container With Most Water",
    difficulty: Difficulty.Medium,
    functionBody: `
function maxArea(height: number[]): number {
  let max = 0;
  let left = 0;
  let right = height.length - 1;
  
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);
    
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return max;
}
    `,
    testCases: maxAreaTestCases,
  },
  {
    id: 6,
    title: "Type Checking",
    difficulty: Difficulty.Easy,
    functionBody: `
function isNumber(value: any): boolean {
  return typeof value === 'number' && isFinite(value);
}
    `,
    testCases: isNumberTestCases,
  },
  {
    id: 7,
    title: "String Reversal",
    difficulty: Difficulty.Easy,
    functionBody: `
function reverseString(str: string): string {
  return str.split('').reverse().join('');
}
    `,
    testCases: reverseStringTestCases,
  },
];

export default mockProblems;
