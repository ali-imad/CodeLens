import { Difficulty, Problem } from "./types";

const mockProblems: Problem[] = [
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
  },
];

export default mockProblems;
