import { Problem } from "./types";

const mockProblems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
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
    title: "Add Two Numbers",
    difficulty: "Medium",
    functionBody: `
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  let dummyHead = new ListNode(0);
  let p = l1, q = l2, curr = dummyHead;
  let carry = 0;
  while (p !== null || q !== null) {
      let x = p ? p.val : 0;
      let y = q ? q.val : 0;
      let sum = carry + x + y;
      carry = Math.floor(sum / 10);
      curr.next = new ListNode(sum % 10);
      curr = curr.next;
      if (p) p = p.next;
      if (q) q = q.next;
  }
  if (carry > 0) {
      curr.next = new ListNode(carry);
  }
  return dummyHead.next;
}
    `,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating",
    difficulty: "Medium",
    functionBody: `
function lengthOfLongestSubstring(s: string): number {
  let map: { [key: string]: number } = {};
  let maxLength = 0;
  for (let i = 0, j = 0; j < s.length; j++) {
    if (map[s[j]] !== undefined) {
      i = Math.max(map[s[j]], i);
    }
    maxLength = Math.max(maxLength, j - i + 1);
    map[s[j]] = j + 1;
  }
  return maxLength;
}
    `,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    functionBody: `
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  const mergedArray = nums1.concat(nums2).sort((a, b) => a - b);
  const n = mergedArray.length;
  return n % 2 !== 0 ? mergedArray[Math.floor(n / 2)] : (mergedArray[n / 2 - 1] + mergedArray[n / 2]) / 2;
}
    `,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    functionBody: `
function longestPalindrome(s: string): string {
  if (s.length < 1) return "";
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    let len1 = expandAroundCenter(s, i, i);
    let len2 = expandAroundCenter(s, i, i + 1);
    let len = Math.max(len1, len2);
    if (len > end - start) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  return s.substring(start, end + 1);
}

function expandAroundCenter(s: string, left: number, right: number): number {
  let L = left, R = right;
  while (L >= 0 && R < s.length && s.charAt(L) === s.charAt(R)) {
    L--;
    R++;
  }
  return R - L - 1;
}
    `,
  },
  {
    id: 6,
    title: "Container With Most Water",
    difficulty: "Medium",
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
    id: 7,
    title: "Integer to Roman",
    difficulty: "Medium",
    functionBody: `
function intToRoman(num: number): string {
  const romanMap: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  
  let result = "";
  
  for (const [value, symbol] of romanMap) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  
  return result;
}
    `,
  },
  {
    id: 8,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    functionBody: `
function isMatch(s: string, p: string): boolean {
  const dp: boolean[][] = Array.from({ length: s.length + 1 }, () =>
    Array(p.length + 1).fill(false)
  );

  dp[0][0] = true;

  for (let j = 1; j < dp[0].length; j++) {
    if (p[j - 1] === "*") {
      dp[0][j] = dp[0][j - 2];
    }
  }

  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[0].length; j++) {
      if (p[j - 1] === "." || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else if (p[j - 1] === "*") {
        dp[i][j] = dp[i][j - 2];
        if (p[j - 2] === "." || p[j - 2] === s[i - 1]) {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
        }
      }
    }
  }

  return dp[s.length][p.length];
}
    `,
  },
  {
    id: 9,
    title: "Wildcard Matching",
    difficulty: "Hard",
    functionBody: `
function isMatch(s: string, p: string): boolean {
  const dp: boolean[][] = Array.from({ length: s.length + 1 }, () =>
    Array(p.length + 1).fill(false)
  );

  dp[0][0] = true;

  for (let j = 1; j < dp[0].length; j++) {
    if (p[j - 1] === "*") {
      dp[0][j] = dp[0][j - 1];
    }
  }

  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[0].length; j++) {
      if (p[j - 1] === "?" || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else if (p[j - 1] === "*") {
        dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      }
    }
  }

  return dp[s.length][p.length];
}
    `,
  },
];

export default mockProblems;
