export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

const twoSumHints = [
  "Notice how an object 'z' is created to store key-value pairs. Think about what keys and values are being stored here.",
  "Observe the 'for' loop iterating over the array 'a'. What is the loop's purpose?",
  "The variable 'y' is calculated as the difference between 'b' (the target sum) and the current element of the array 'a'. Why might this difference be important?",
  "There is a condition 'if (y in z)'. Consider what this condition is checking for and why it's crucial to solving the problem.",
  "When the condition is met, the function returns an array '[z[y], i]'. What do these indices represent?",
  "If the condition is not met, the current element of the array 'a' is stored in 'z' with its index as the value. Think about how this helps in future iterations.",
  "Reflect on how the object 'z' is used to keep track of elements and their indices. How does this assist in quickly finding the solution?",
];

const isPalindromeHints = [
  "Consider the role of 'split('')', 'reverse()', and 'join('')' methods. How do these methods work together to manipulate the string?",
  "Consider that 'toLowerCase()' method is used on the cleaned string.",
  'Consider the overall structure of the function. What is happening to the input before performing the check?',
  'Notice how the function uses a regular expression to remove all non-alphanumeric characters from the string.',
];

const objectEqualsHints = [
  "The function first checks if 'a' and 'b' are strictly equal. What is the purpose of this case?",
  'Consider why the function returns true at the end if all the checks pass.',
  "Consider why the function immediately returns false if either 'a' or 'b' is null, or if they are not objects.",
  "Notice how 'z' and 'y' store the keys of objects 'a' and 'b' respectively. Why is comparing keys important?",
  'The function checks if the lengths of the keys arrays are different. Why would this mean the objects are not equal?',
  "For each key in 'a', the function checks if 'b' has the same key and if the values for that key in both objects are deeply equal. Why is this recursive check necessary?",
  'Reflect on why recursion is used in this function. Why is recursion a good approach for this purpose?',
];

const mergedMedianHints = [
  "Notice how the function concatenates the two input arrays 'a' and 'b' into a single array 'z'. Why might it be necessary to combine these arrays?",
  "The combined array 'z' is then sorted using a comparison function. How does the comparison function ensure the array is sorted numerically?",
  "Consider why the length of the combined array 'z' is stored in the variable 'y'.",
  "Think about what the condition 'y % 2 !== 0' is checking for. What does it mean for the array length to be odd?",
  "When the array length is odd, what does 'Math.floor(y / 2)' help us find?",
  "If the array length is even, consider what '(z[y / 2 - 1] + z[y / 2]) / 2' calculates",
];

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
  { input: ['A man, a plan, a canal: Panama'], expectedOutput: true },
  { input: ['race a car'], expectedOutput: false },
  { input: [' '], expectedOutput: true },
  { input: ['0P'], expectedOutput: false },
  { input: ['madam'], expectedOutput: true },
];

const deepEqualTestCases = [
  {
    input: { a: { name: 'Alice' }, b: { name: 'Alice' } },
    expectedOutput: true,
  },
  {
    input: { a: { name: 'Alice' }, b: { name: 'Bob' } },
    expectedOutput: false,
  },
  { input: { a: [1, 2, 3], b: [1, 2, 3] }, expectedOutput: true },
  { input: { a: [1, 2, 3], b: [3, 2, 1] }, expectedOutput: false },
  {
    input: { a: { name: 'Alice', age: 25 }, b: { name: 'Alice', age: 25 } },
    expectedOutput: true,
  },
];
const maxAreaTestCases = [
  { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expectedOutput: 49 },
  { input: [[1, 1]], expectedOutput: 1 },
  { input: [[4, 3, 2, 1, 4]], expectedOutput: 16 },
  { input: [[1, 2, 1]], expectedOutput: 2 },
  { input: [[2, 3, 10, 5, 7, 8, 9]], expectedOutput: 36 },
];
const isNumberTestCases = [
  { input: [123], expectedOutput: true },
  { input: ['123'], expectedOutput: false },
  { input: [Infinity], expectedOutput: false },
  { input: [-123.45], expectedOutput: true },
  { input: [NaN], expectedOutput: false },
];

const reverseStringTestCases = [
  { input: ['hello'], expectedOutput: 'olleh' },
  { input: ['world'], expectedOutput: 'dlrow' },
  { input: ['12345'], expectedOutput: '54321' },
  { input: ['racecar'], expectedOutput: 'racecar' },
  { input: [''], expectedOutput: '' },
];

const maxAreaHints = [
  "Notice how two pointers, 'b' and 'c', are initialized to the start and end of the array, respectively. Why might the function use two pointers?",
  "Observe that the while loop continues as long as 'b' is less than 'c'. What is the significance of this condition?",
  "Consider the calculation of 'y' using 'Math.min(a[b], a[c]) * (c - b)'. Assume that these values of 'a' correspond to heights at that index. What geometric calculation are we making here?",
  "Reflect on the update of 'z' with 'Math.max(z, y)'. What is the purpose of keeping track of the maximum value of 'y'?",
  "Think about why the function increments 'b' if 'a[b]' is less than 'a[c]', and decrements 'c' otherwise. What does this decision aim to achieve?",
  "Observe how the function returns 'z' at the end. What does 'z' represent in the context of this function?",
];

const isNumberHints = [
  'Make sure you consider all possible types',
  'Come on now, just read the methods being called and checked!',
];

const stringReverseHints = [
  'What methods are being used to manipulate this string?',
  'What does calling .split() followed by .join() do?',
  'What does calling .reverse() do? Consider that this is occuring between .split() and .join().',
];
const mockProblems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: Difficulty.Easy,
    functionBody: `
function foo(a: number[], b: number): number[] {
  const z: { [key: number]: number } = {};
  for (let i = 0; i < a.length; i++) {
    const y = b - a[i];
    if (y in z) {
      return [z[y], i];
    }
    z[a[i]] = i;
  }
  throw new Error("No solution");
}
    `,
    testCases: twoSumTestCases,
    hints: twoSumHints,
  },
  {
    id: 2,
    title: 'Palindrome Check',
    difficulty: Difficulty.Easy,
    functionBody: `
function foo(s: string): boolean {
  const z = s.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  return z === z.split('').reverse().join('');
}
    `,
    testCases: isPalindromeTestCases,
    hints: isPalindromeHints,
  },
  {
    id: 3,
    title: 'Median of Two Sorted Arrays',
    difficulty: Difficulty.Hard,
    functionBody: `
function foo(a: number[], b: number[]): number {
  // a and b are already sorted
  const z = a.concat(b).sort((c, d) => c - d);
  const y = z.length;
  return y % 2 !== 0 ? z[Math.floor(y / 2)] : (z[y / 2 - 1] + z[y / 2]) / 2;
}
    `,
    testCases: findMedianSortedArraysTestCases,
    hints: mergedMedianHints,
  },
  {
    id: 4,
    title: 'Deep Comparison',
    difficulty: Difficulty.Medium,
    functionBody: `
function foo(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || typeof a != "object" || b == null || typeof b != "object") return false;

  let z = Object.keys(a), y = Object.keys(b);
  if (z.length != y.length) return false;
  for (let x of z) {
    if (!y.includes(x) || !foo(a[x], b[x])) return false;
  }
  return true;
}
    `,
    testCases: deepEqualTestCases,
    hints: objectEqualsHints,
  },
  {
    id: 5,
    title: 'Container With Most Water',
    difficulty: Difficulty.Medium,
    functionBody: `
function foo(a: number[]): number {
  let z = 0;
  let b = 0;
  let c = a.length - 1;

  while (b < c) {
    const y = Math.min(a[b], a[c]) * (c - b);
    z = Math.max(z, y);

    if (a[b] < a[c]) {
      b++;
    } else {
      c--;
    }
  }

  return z;
}
    `,
    testCases: maxAreaTestCases,
    hints: maxAreaHints,
  },
  {
    id: 6,
    title: 'Type Checking',
    difficulty: Difficulty.Easy,
    functionBody: `
function foo(a: any): boolean {
  return typeof a === 'number' && isFinite(a);
}
    `,
    testCases: isNumberTestCases,
    hints: isNumberHints,
  },
  {
    id: 7,
    title: 'String Reversal',
    difficulty: Difficulty.Easy,
    functionBody: `
function foo(a: string): string {
  return a.split('').reverse().join('');
}
    `,
    testCases: reverseStringTestCases,
    hints: stringReverseHints,
  },
];

export default mockProblems;
