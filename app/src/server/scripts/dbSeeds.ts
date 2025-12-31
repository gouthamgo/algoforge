import { faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";
import { type User } from "wasp/entities";
import {
  getSubscriptionPaymentPlanIds,
  SubscriptionStatus,
} from "../../payment/plans";

type MockUserData = Omit<User, "id">;

/**
 * NeetCode 150-style curated curriculum
 * Essential problems for each pattern - quality over quantity
 * Ordered for optimal learning progression
 */
export async function seedLessonContent(prismaClient: PrismaClient) {
  console.log("🌱 Seeding curated lesson content...");

  // ========================================
  // TOPIC 1: FUNDAMENTALS
  // ========================================
  const fundamentalsTopic = await prismaClient.topic.upsert({
    where: { slug: "fundamentals" },
    update: {},
    create: {
      slug: "fundamentals",
      title: "Fundamentals",
      description: "Master the core building blocks: Arrays, Hashing, Two Pointers, Sliding Window, and Stack. These patterns form the foundation for 70% of interview problems.",
      order: 1,
      iconName: "BookOpen",
      theoryContent: `# Fundamentals

The foundation of coding interviews. Master these 5 patterns and you'll be able to tackle the majority of interview problems.

## Learning Path

1. **Arrays & Hashing** - O(1) lookups with hash maps
2. **Two Pointers** - Efficient array traversal
3. **Sliding Window** - Subarray/substring optimization
4. **Stack** - LIFO for parsing and matching
5. **Binary Search** - O(log n) search in sorted data

## Why This Order?

Each pattern builds on the previous. Two Pointers uses array fundamentals. Sliding Window is a specialized Two Pointers technique. Stack introduces a new data structure. Binary Search teaches divide-and-conquer thinking.`,
      estimatedHours: 20,
      difficulty: "beginner",
      isPublished: true,
      isPremium: false,
    },
  });

  // ========================================
  // PATTERN 1: ARRAYS & HASHING
  // ========================================
  const arraysHashingPattern = await prismaClient.pattern.upsert({
    where: { slug: "arrays-hashing" },
    update: {},
    create: {
      slug: "arrays-hashing",
      title: "Arrays & Hashing",
      description: "The foundation of all DSA. Use hash maps for O(1) lookups to avoid nested loops.",
      order: 1,
      topicId: fundamentalsTopic.id,
      explanation: `# Arrays & Hashing

## Core Concept

The key insight: **Use a hash map to trade space for time.**

Instead of O(n²) nested loops checking every pair, store values in a hash map for O(1) lookups.

## When to Use

- Finding pairs/complements (Two Sum)
- Counting frequencies (Top K, Anagrams)
- Checking for duplicates
- Grouping related items

## The Pattern

\`\`\`python
def solve(nums):
    seen = {}  # hash map for O(1) lookups

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []
\`\`\`

## Complexity

- **Time**: O(n) - single pass
- **Space**: O(n) - hash map storage

## Common Mistakes

1. Using nested loops when hash map works
2. Forgetting to handle edge cases (empty array)
3. Not considering what to store (index vs value vs count)`,
      template: `def solve(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        # What are we looking for?
        complement = target - num

        # Did we see it before?
        if complement in seen:
            return [seen[complement], i]

        # Store current for future lookups
        seen[num] = i

    return []`,
      isPremium: false,
    },
  });

  // Problem 1.1: Contains Duplicate (warmup)
  await prismaClient.problem.upsert({
    where: { slug: "contains-duplicate" },
    update: { order: 1 },
    create: {
      slug: "contains-duplicate",
      title: "Contains Duplicate",
      order: 1,
      difficulty: "easy",
      patternId: arraysHashingPattern.id,
      estimatedMinutes: 10,
      description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
      constraints: `- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9`,
      examples: JSON.stringify([
        { input: "nums = [1,2,3,1]", output: "true", explanation: "1 appears twice." },
        { input: "nums = [1,2,3,4]", output: "false", explanation: "All elements are distinct." },
        { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true", explanation: "Multiple duplicates exist." },
      ]),
      hints: JSON.stringify([
        "What data structure gives O(1) lookup?",
        "A set stores unique elements. What happens when you try to add a duplicate?",
        "Alternative: Sort the array. Duplicates will be adjacent.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Hash Set",
          complexity: { time: "O(n)", space: "O(n)" },
          code: {
            python: `def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
            javascript: `function containsDuplicate(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}`,
          },
          explanation: "Use a set for O(1) lookups. If we've seen the number before, it's a duplicate.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def containsDuplicate(nums: list[int]) -> bool:
    # Your code here
    pass`,
        javascript: `function containsDuplicate(nums) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { nums: [1, 2, 3, 1] }, expected: true },
        { input: { nums: [1, 2, 3, 4] }, expected: false },
        { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, expected: true },
      ]),
    },
  });

  // Problem 1.2: Valid Anagram
  await prismaClient.problem.upsert({
    where: { slug: "valid-anagram" },
    update: { order: 2 },
    create: {
      slug: "valid-anagram",
      title: "Valid Anagram",
      order: 2,
      difficulty: "easy",
      patternId: arraysHashingPattern.id,
      estimatedMinutes: 15,
      description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **anagram** is a word formed by rearranging the letters of another word, using all the original letters exactly once.`,
      constraints: `- 1 <= s.length, t.length <= 5 * 10^4
- s and t consist of lowercase English letters.`,
      examples: JSON.stringify([
        { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "Both have same character counts." },
        { input: 's = "rat", t = "car"', output: "false", explanation: "Different characters." },
      ]),
      hints: JSON.stringify([
        "Anagrams have the same character counts.",
        "Use a hash map to count character frequencies.",
        "Compare the frequency maps of both strings.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Character Count",
          complexity: { time: "O(n)", space: "O(1)" },
          code: {
            python: `def isAnagram(s, t):
    if len(s) != len(t):
        return False

    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1

    for c in t:
        if c not in count:
            return False
        count[c] -= 1
        if count[c] < 0:
            return False

    return True`,
            javascript: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;

    const count = {};
    for (const c of s) {
        count[c] = (count[c] || 0) + 1;
    }

    for (const c of t) {
        if (!count[c]) return false;
        count[c]--;
    }

    return true;
}`,
          },
          explanation: "Count characters in s, then decrement for t. If any count goes negative or char not found, not an anagram.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def isAnagram(s: str, t: str) -> bool:
    # Your code here
    pass`,
        javascript: `function isAnagram(s, t) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { s: "anagram", t: "nagaram" }, expected: true },
        { input: { s: "rat", t: "car" }, expected: false },
        { input: { s: "a", t: "a" }, expected: true },
      ]),
    },
  });

  // Problem 1.3: Two Sum (THE classic)
  await prismaClient.problem.upsert({
    where: { slug: "two-sum" },
    update: { order: 3 },
    create: {
      slug: "two-sum",
      title: "Two Sum",
      order: 3,
      difficulty: "easy",
      patternId: arraysHashingPattern.id,
      estimatedMinutes: 15,
      description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
      constraints: `- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
      examples: JSON.stringify([
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6" },
        { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "nums[0] + nums[1] = 3 + 3 = 6" },
      ]),
      hints: JSON.stringify([
        "For each number, what value would you need to find?",
        "If nums[i] + x = target, then x = target - nums[i]",
        "Use a hash map to store numbers you've seen.",
        "Check if the complement exists before adding current number.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Hash Map (One Pass)",
          complexity: { time: "O(n)", space: "O(n)" },
          code: {
            python: `def twoSum(nums, target):
    seen = {}  # value -> index

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []`,
            javascript: `function twoSum(nums, target) {
    const seen = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }

        seen.set(nums[i], i);
    }

    return [];
}`,
          },
          explanation: "For each number, check if its complement (target - num) was seen before. If yes, we found our pair!",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass`,
        javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
        { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
      ]),
    },
  });

  // Problem 1.4: Group Anagrams
  await prismaClient.problem.upsert({
    where: { slug: "group-anagrams" },
    update: { order: 4 },
    create: {
      slug: "group-anagrams",
      title: "Group Anagrams",
      order: 4,
      difficulty: "medium",
      patternId: arraysHashingPattern.id,
      estimatedMinutes: 20,
      description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in **any order**.`,
      constraints: `- 1 <= strs.length <= 10^4
- 0 <= strs[i].length <= 100
- strs[i] consists of lowercase English letters.`,
      examples: JSON.stringify([
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: "Group words that are anagrams of each other." },
        { input: 'strs = [""]', output: '[[""]]', explanation: "Single empty string." },
        { input: 'strs = ["a"]', output: '[["a"]]', explanation: "Single character." },
      ]),
      hints: JSON.stringify([
        "What identifies an anagram group?",
        "Sorted characters of anagrams are identical.",
        "Use sorted string as hash map key.",
        "Or: use character count tuple as key.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Sorted String Key",
          complexity: { time: "O(n * k log k)", space: "O(n * k)" },
          code: {
            python: `def groupAnagrams(strs):
    groups = {}

    for s in strs:
        # Sorted string as key
        key = ''.join(sorted(s))

        if key not in groups:
            groups[key] = []
        groups[key].append(s)

    return list(groups.values())`,
            javascript: `function groupAnagrams(strs) {
    const groups = new Map();

    for (const s of strs) {
        const key = s.split('').sort().join('');

        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(s);
    }

    return Array.from(groups.values());
}`,
          },
          explanation: "Anagrams have the same sorted characters. Use sorted string as key to group them.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Your code here
    pass`,
        javascript: `function groupAnagrams(strs) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] },
        { input: { strs: [""] }, expected: [[""]] },
        { input: { strs: ["a"] }, expected: [["a"]] },
      ]),
    },
  });

  // Problem 1.5: Top K Frequent Elements
  await prismaClient.problem.upsert({
    where: { slug: "top-k-frequent-elements" },
    update: { order: 5 },
    create: {
      slug: "top-k-frequent-elements",
      title: "Top K Frequent Elements",
      order: 5,
      difficulty: "medium",
      patternId: arraysHashingPattern.id,
      estimatedMinutes: 25,
      description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in **any order**.`,
      constraints: `- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4
- k is in the range [1, the number of unique elements]
- The answer is guaranteed to be unique.`,
      examples: JSON.stringify([
        { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "1 appears 3 times, 2 appears 2 times." },
        { input: "nums = [1], k = 1", output: "[1]", explanation: "Only one element." },
      ]),
      hints: JSON.stringify([
        "First, count frequencies using a hash map.",
        "Then find the k highest frequencies.",
        "Bucket sort: index = frequency, value = list of elements.",
        "Iterate buckets from high to low to get top k.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Bucket Sort",
          complexity: { time: "O(n)", space: "O(n)" },
          code: {
            python: `def topKFrequent(nums, k):
    # Count frequencies
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1

    # Bucket sort: index = frequency
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items():
        buckets[freq].append(num)

    # Collect top k from highest frequency
    result = []
    for i in range(len(buckets) - 1, 0, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result

    return result`,
            javascript: `function topKFrequent(nums, k) {
    const count = new Map();
    for (const num of nums) {
        count.set(num, (count.get(num) || 0) + 1);
    }

    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [num, freq] of count) {
        buckets[freq].push(num);
    }

    const result = [];
    for (let i = buckets.length - 1; i > 0 && result.length < k; i--) {
        result.push(...buckets[i]);
    }

    return result.slice(0, k);
}`,
          },
          explanation: "Count frequencies, then use bucket sort where index = frequency. Collect from highest buckets.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    # Your code here
    pass`,
        javascript: `function topKFrequent(nums, k) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, expected: [1, 2] },
        { input: { nums: [1], k: 1 }, expected: [1] },
      ]),
    },
  });

  // Problem 1.6: Product of Array Except Self
  await prismaClient.problem.upsert({
    where: { slug: "product-of-array-except-self" },
    update: { order: 6 },
    create: {
      slug: "product-of-array-except-self",
      title: "Product of Array Except Self",
      order: 6,
      difficulty: "medium",
      patternId: arraysHashingPattern.id,
      estimatedMinutes: 25,
      description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must write an algorithm that runs in O(n) time and **without using the division operation**.`,
      constraints: `- 2 <= nums.length <= 10^5
- -30 <= nums[i] <= 30
- The product of any prefix or suffix is guaranteed to fit in a 32-bit integer.`,
      examples: JSON.stringify([
        { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, etc." },
        { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]", explanation: "Zero makes most products zero." },
      ]),
      hints: JSON.stringify([
        "For each position, you need product of left side × product of right side.",
        "Can you precompute prefix and suffix products?",
        "Prefix[i] = product of all elements before i",
        "Suffix[i] = product of all elements after i",
        "Answer[i] = Prefix[i] × Suffix[i]",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Prefix & Suffix Products",
          complexity: { time: "O(n)", space: "O(1)" },
          code: {
            python: `def productExceptSelf(nums):
    n = len(nums)
    result = [1] * n

    # Build prefix products in result
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]

    # Multiply by suffix products
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]

    return result`,
            javascript: `function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);

    let prefix = 1;
    for (let i = 0; i < n; i++) {
        result[i] = prefix;
        prefix *= nums[i];
    }

    let suffix = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }

    return result;
}`,
          },
          explanation: "For each position: result = (product of everything before) × (product of everything after). Compute in two passes.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def productExceptSelf(nums: list[int]) -> list[int]:
    # Your code here
    pass`,
        javascript: `function productExceptSelf(nums) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { nums: [1, 2, 3, 4] }, expected: [24, 12, 8, 6] },
        { input: { nums: [-1, 1, 0, -3, 3] }, expected: [0, 0, 9, 0, 0] },
      ]),
    },
  });

  // ========================================
  // PATTERN 2: TWO POINTERS
  // ========================================
  const twoPointersPattern = await prismaClient.pattern.upsert({
    where: { slug: "two-pointers" },
    update: {},
    create: {
      slug: "two-pointers",
      title: "Two Pointers",
      description: "Use two pointers moving toward each other or in same direction to solve array problems efficiently.",
      order: 2,
      topicId: fundamentalsTopic.id,
      explanation: `# Two Pointers

## Core Concept

Use two pointers to traverse an array efficiently. Common variants:

1. **Opposite ends**: Left starts at 0, right at end, move toward center
2. **Same direction**: Fast and slow pointers
3. **Two arrays**: One pointer in each array

## When to Use

- Sorted array problems
- Finding pairs with a target sum
- Removing duplicates in-place
- Palindrome checking
- Merging sorted arrays

## The Pattern

\`\`\`python
def solve(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        if condition_met:
            return result
        elif need_smaller:
            right -= 1
        else:
            left += 1

    return default
\`\`\`

## Key Insight

Sorted arrays let you make informed decisions about which pointer to move, eliminating O(n²) brute force.`,
      template: `def solve(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        current = nums[left] + nums[right]

        if current == target:
            return [left, right]
        elif current < target:
            left += 1  # need larger sum
        else:
            right -= 1  # need smaller sum

    return []`,
      isPremium: false,
    },
  });

  // Problem 2.1: Valid Palindrome
  await prismaClient.problem.upsert({
    where: { slug: "valid-palindrome" },
    update: { order: 1 },
    create: {
      slug: "valid-palindrome",
      title: "Valid Palindrome",
      order: 1,
      difficulty: "easy",
      patternId: twoPointersPattern.id,
      estimatedMinutes: 15,
      description: `Given a string \`s\`, return \`true\` if it is a **palindrome**, or \`false\` otherwise.

A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.`,
      constraints: `- 1 <= s.length <= 2 * 10^5
- s consists only of printable ASCII characters.`,
      examples: JSON.stringify([
        { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
        { input: 's = "race a car"', output: "false", explanation: '"raceacar" is not a palindrome.' },
        { input: 's = " "', output: "true", explanation: "Empty string after removing non-alphanumeric is palindrome." },
      ]),
      hints: JSON.stringify([
        "Use two pointers: one from start, one from end.",
        "Skip non-alphanumeric characters.",
        "Compare characters (case-insensitive) until pointers meet.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Two Pointers",
          complexity: { time: "O(n)", space: "O(1)" },
          code: {
            python: `def isPalindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        # Skip non-alphanumeric
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        # Compare (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True`,
            javascript: `function isPalindrome(s) {
    let left = 0, right = s.length - 1;

    while (left < right) {
        while (left < right && !isAlphaNum(s[left])) left++;
        while (left < right && !isAlphaNum(s[right])) right--;

        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}

function isAlphaNum(c) {
    return /[a-zA-Z0-9]/.test(c);
}`,
          },
          explanation: "Two pointers from ends, skip non-alphanumeric, compare characters.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def isPalindrome(s: str) -> bool:
    # Your code here
    pass`,
        javascript: `function isPalindrome(s) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { s: "A man, a plan, a canal: Panama" }, expected: true },
        { input: { s: "race a car" }, expected: false },
        { input: { s: " " }, expected: true },
      ]),
    },
  });

  // Problem 2.2: Two Sum II (sorted array)
  await prismaClient.problem.upsert({
    where: { slug: "two-sum-ii" },
    update: { order: 2 },
    create: {
      slug: "two-sum-ii",
      title: "Two Sum II - Input Array Is Sorted",
      order: 2,
      difficulty: "medium",
      patternId: twoPointersPattern.id,
      estimatedMinutes: 15,
      description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers (1-indexed) as an integer array \`[index1, index2]\`.

You may not use the same element twice. Your solution must use only constant extra space.`,
      constraints: `- 2 <= numbers.length <= 3 * 10^4
- -1000 <= numbers[i] <= 1000
- numbers is sorted in non-decreasing order.
- -1000 <= target <= 1000
- There is exactly one solution.`,
      examples: JSON.stringify([
        { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]", explanation: "2 + 7 = 9. Return [1, 2] (1-indexed)." },
        { input: "numbers = [2,3,4], target = 6", output: "[1,3]", explanation: "2 + 4 = 6." },
        { input: "numbers = [-1,0], target = -1", output: "[1,2]", explanation: "-1 + 0 = -1." },
      ]),
      hints: JSON.stringify([
        "Array is sorted! Use this property.",
        "If sum is too small, we need a larger number.",
        "If sum is too large, we need a smaller number.",
        "Two pointers from opposite ends.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Two Pointers",
          complexity: { time: "O(n)", space: "O(1)" },
          code: {
            python: `def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1  # need larger sum
        else:
            right -= 1  # need smaller sum

    return []`,
            javascript: `function twoSum(numbers, target) {
    let left = 0, right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        if (sum === target) {
            return [left + 1, right + 1];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return [];
}`,
          },
          explanation: "Sorted array + target sum = two pointers. Move left for larger sum, right for smaller.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def twoSum(numbers: list[int], target: int) -> list[int]:
    # Your code here
    pass`,
        javascript: `function twoSum(numbers, target) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { numbers: [2, 7, 11, 15], target: 9 }, expected: [1, 2] },
        { input: { numbers: [2, 3, 4], target: 6 }, expected: [1, 3] },
        { input: { numbers: [-1, 0], target: -1 }, expected: [1, 2] },
      ]),
    },
  });

  // Problem 2.3: 3Sum
  await prismaClient.problem.upsert({
    where: { slug: "3sum" },
    update: { order: 3 },
    create: {
      slug: "3sum",
      title: "3Sum",
      order: 3,
      difficulty: "medium",
      patternId: twoPointersPattern.id,
      estimatedMinutes: 30,
      description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
      constraints: `- 3 <= nums.length <= 3000
- -10^5 <= nums[i] <= 10^5`,
      examples: JSON.stringify([
        { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Two unique triplets sum to 0." },
        { input: "nums = [0,1,1]", output: "[]", explanation: "No triplet sums to 0." },
        { input: "nums = [0,0,0]", output: "[[0,0,0]]", explanation: "Only triplet that sums to 0." },
      ]),
      hints: JSON.stringify([
        "Sort the array first.",
        "Fix one element, then use Two Sum II on the rest.",
        "Skip duplicates to avoid duplicate triplets.",
        "If current element > 0, no solution possible (sorted array).",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Sort + Two Pointers",
          complexity: { time: "O(n²)", space: "O(1)" },
          code: {
            python: `def threeSum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        # Skip duplicates for i
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        # Early termination
        if nums[i] > 0:
            break

        # Two pointers for remaining
        left, right = i + 1, len(nums) - 1

        while left < right:
            total = nums[i] + nums[left] + nums[right]

            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1

    return result`,
            javascript: `function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];

    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        if (nums[i] > 0) break;

        let left = i + 1, right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
}`,
          },
          explanation: "Sort, fix one element, use two pointers for remaining two. Skip duplicates carefully.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Your code here
    pass`,
        javascript: `function threeSum(nums) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]] },
        { input: { nums: [0, 1, 1] }, expected: [] },
        { input: { nums: [0, 0, 0] }, expected: [[0, 0, 0]] },
      ]),
    },
  });

  // Problem 2.4: Container With Most Water
  await prismaClient.problem.upsert({
    where: { slug: "container-with-most-water" },
    update: { order: 4 },
    create: {
      slug: "container-with-most-water",
      title: "Container With Most Water",
      order: 4,
      difficulty: "medium",
      patternId: twoPointersPattern.id,
      estimatedMinutes: 25,
      description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
      constraints: `- n == height.length
- 2 <= n <= 10^5
- 0 <= height[i] <= 10^4`,
      examples: JSON.stringify([
        { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at index 1 and 8 form container with area 7 * 7 = 49." },
        { input: "height = [1,1]", output: "1", explanation: "Only container possible has area 1." },
      ]),
      hints: JSON.stringify([
        "Area = width × min(left_height, right_height)",
        "Start with maximum width (pointers at ends).",
        "Which pointer should we move to potentially find larger area?",
        "Move the shorter line - the taller one can't help if the short one limits us.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Two Pointers",
          complexity: { time: "O(n)", space: "O(1)" },
          code: {
            python: `def maxArea(height):
    left, right = 0, len(height) - 1
    max_water = 0

    while left < right:
        # Calculate current area
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)

        # Move the shorter line
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_water`,
            javascript: `function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxWater = 0;

    while (left < right) {
        const width = right - left;
        const h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, width * h);

        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxWater;
}`,
          },
          explanation: "Start wide, calculate area, move the shorter line (it's the limiting factor).",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def maxArea(height: list[int]) -> int:
    # Your code here
    pass`,
        javascript: `function maxArea(height) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49 },
        { input: { height: [1, 1] }, expected: 1 },
      ]),
    },
  });

  // ========================================
  // PATTERN 3: SLIDING WINDOW
  // ========================================
  const slidingWindowPattern = await prismaClient.pattern.upsert({
    where: { slug: "sliding-window" },
    update: {},
    create: {
      slug: "sliding-window",
      title: "Sliding Window",
      description: "Optimize subarray/substring problems by maintaining a window that slides through the data.",
      order: 3,
      topicId: fundamentalsTopic.id,
      explanation: `# Sliding Window

## Core Concept

Maintain a "window" over a contiguous portion of the array/string. Expand or shrink the window based on conditions.

## Two Types

### 1. Fixed Size Window
Window size is given (e.g., "maximum sum of k consecutive elements").

### 2. Variable Size Window
Window size changes based on conditions (e.g., "longest substring without repeating").

## The Pattern

\`\`\`python
def slidingWindow(s):
    left = 0
    window = {}  # or other state
    result = 0

    for right in range(len(s)):
        # Expand window: add s[right]
        window[s[right]] = window.get(s[right], 0) + 1

        # Shrink window if invalid
        while window_is_invalid:
            window[s[left]] -= 1
            left += 1

        # Update result
        result = max(result, right - left + 1)

    return result
\`\`\`

## Key Insight

Instead of recalculating for every subarray (O(n²)), maintain running state as window slides (O(n)).`,
      template: `def slidingWindow(s, k):
    left = 0
    window = {}  # track window state
    result = 0

    for right in range(len(s)):
        # 1. Expand: add element at right
        window[s[right]] = window.get(s[right], 0) + 1

        # 2. Shrink: while window is invalid
        while len(window) > k:  # example condition
            window[s[left]] -= 1
            if window[s[left]] == 0:
                del window[s[left]]
            left += 1

        # 3. Update result
        result = max(result, right - left + 1)

    return result`,
      isPremium: false,
    },
  });

  // Problem 3.1: Best Time to Buy and Sell Stock
  await prismaClient.problem.upsert({
    where: { slug: "best-time-to-buy-and-sell-stock" },
    update: { order: 1 },
    create: {
      slug: "best-time-to-buy-and-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      order: 1,
      difficulty: "easy",
      patternId: slidingWindowPattern.id,
      estimatedMinutes: 15,
      description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve. If you cannot achieve any profit, return \`0\`.`,
      constraints: `- 1 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4`,
      examples: JSON.stringify([
        { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
        { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices only decrease. No profit possible." },
      ]),
      hints: JSON.stringify([
        "Track the minimum price seen so far.",
        "At each day, calculate potential profit if selling today.",
        "Update maximum profit if current profit is higher.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "One Pass",
          complexity: { time: "O(n)", space: "O(1)" },
          code: {
            python: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        min_price = min(min_price, price)
        profit = price - min_price
        max_profit = max(max_profit, profit)

    return max_profit`,
            javascript: `function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;

    for (const price of prices) {
        minPrice = Math.min(minPrice, price);
        const profit = price - minPrice;
        maxProfit = Math.max(maxProfit, profit);
    }

    return maxProfit;
}`,
          },
          explanation: "Track minimum price seen. At each price, check if selling now gives max profit.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def maxProfit(prices: list[int]) -> int:
    # Your code here
    pass`,
        javascript: `function maxProfit(prices) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5 },
        { input: { prices: [7, 6, 4, 3, 1] }, expected: 0 },
      ]),
    },
  });

  // Problem 3.2: Longest Substring Without Repeating Characters
  await prismaClient.problem.upsert({
    where: { slug: "longest-substring-without-repeating-characters" },
    update: { order: 2 },
    create: {
      slug: "longest-substring-without-repeating-characters",
      title: "Longest Substring Without Repeating Characters",
      order: 2,
      difficulty: "medium",
      patternId: slidingWindowPattern.id,
      estimatedMinutes: 25,
      description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
      constraints: `- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.`,
      examples: JSON.stringify([
        { input: 's = "abcabcbb"', output: "3", explanation: 'Longest is "abc" with length 3.' },
        { input: 's = "bbbbb"', output: "1", explanation: 'Longest is "b" with length 1.' },
        { input: 's = "pwwkew"', output: "3", explanation: 'Longest is "wke" with length 3.' },
      ]),
      hints: JSON.stringify([
        "Use sliding window with variable size.",
        "Expand window until you find a duplicate.",
        "When duplicate found, shrink from left until valid.",
        "Track characters in current window with a set or map.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Sliding Window + Set",
          complexity: { time: "O(n)", space: "O(min(n, m))" },
          code: {
            python: `def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_length = 0

    for right in range(len(s)):
        # Shrink window if duplicate
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1

        # Add current char
        char_set.add(s[right])

        # Update max length
        max_length = max(max_length, right - left + 1)

    return max_length`,
            javascript: `function lengthOfLongestSubstring(s) {
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }

        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}`,
          },
          explanation: "Expand window, if duplicate exists shrink from left until valid, track max length.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def lengthOfLongestSubstring(s: str) -> int:
    # Your code here
    pass`,
        javascript: `function lengthOfLongestSubstring(s) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { s: "abcabcbb" }, expected: 3 },
        { input: { s: "bbbbb" }, expected: 1 },
        { input: { s: "pwwkew" }, expected: 3 },
        { input: { s: "" }, expected: 0 },
      ]),
    },
  });

  // Problem 3.3: Longest Repeating Character Replacement
  await prismaClient.problem.upsert({
    where: { slug: "longest-repeating-character-replacement" },
    update: { order: 3 },
    create: {
      slug: "longest-repeating-character-replacement",
      title: "Longest Repeating Character Replacement",
      order: 3,
      difficulty: "medium",
      patternId: slidingWindowPattern.id,
      estimatedMinutes: 30,
      description: `You are given a string \`s\` and an integer \`k\`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most \`k\` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.`,
      constraints: `- 1 <= s.length <= 10^5
- s consists of only uppercase English letters.
- 0 <= k <= s.length`,
      examples: JSON.stringify([
        { input: 's = "ABAB", k = 2', output: "4", explanation: "Replace both 'A's with 'B's or vice versa." },
        { input: 's = "AABABBA", k = 1', output: "4", explanation: 'Replace the one "A" in the middle with "B" and form "AABBBBA".' },
      ]),
      hints: JSON.stringify([
        "Window is valid if: (window size) - (count of most frequent char) <= k",
        "Track count of each character in window.",
        "Track the maximum frequency of any character in window.",
        "Shrink window when invalid.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Sliding Window",
          complexity: { time: "O(n)", space: "O(26) = O(1)" },
          code: {
            python: `def characterReplacement(s, k):
    count = {}
    left = 0
    max_freq = 0
    result = 0

    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_freq = max(max_freq, count[s[right]])

        # Window is invalid if we need more than k replacements
        window_size = right - left + 1
        if window_size - max_freq > k:
            count[s[left]] -= 1
            left += 1

        result = max(result, right - left + 1)

    return result`,
            javascript: `function characterReplacement(s, k) {
    const count = {};
    let left = 0;
    let maxFreq = 0;
    let result = 0;

    for (let right = 0; right < s.length; right++) {
        count[s[right]] = (count[s[right]] || 0) + 1;
        maxFreq = Math.max(maxFreq, count[s[right]]);

        const windowSize = right - left + 1;
        if (windowSize - maxFreq > k) {
            count[s[left]]--;
            left++;
        }

        result = Math.max(result, right - left + 1);
    }

    return result;
}`,
          },
          explanation: "Valid window: chars to replace = window_size - max_freq <= k. Shrink when invalid.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def characterReplacement(s: str, k: int) -> int:
    # Your code here
    pass`,
        javascript: `function characterReplacement(s, k) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { s: "ABAB", k: 2 }, expected: 4 },
        { input: { s: "AABABBA", k: 1 }, expected: 4 },
      ]),
    },
  });

  // Problem 3.4: Minimum Window Substring
  await prismaClient.problem.upsert({
    where: { slug: "minimum-window-substring" },
    update: { order: 4 },
    create: {
      slug: "minimum-window-substring",
      title: "Minimum Window Substring",
      order: 4,
      difficulty: "hard",
      patternId: slidingWindowPattern.id,
      estimatedMinutes: 40,
      description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.

The testcases will be generated such that the answer is **unique**.`,
      constraints: `- m == s.length
- n == t.length
- 1 <= m, n <= 10^5
- s and t consist of uppercase and lowercase English letters.`,
      examples: JSON.stringify([
        { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: "Minimum window containing A, B, C is 'BANC'." },
        { input: 's = "a", t = "a"', output: '"a"', explanation: "Entire string is the minimum window." },
        { input: 's = "a", t = "aa"', output: '""', explanation: "Both 'a's from t must be in window. Not possible." },
      ]),
      hints: JSON.stringify([
        "Count characters needed from t.",
        "Expand window until all characters satisfied.",
        "Shrink window while still valid to find minimum.",
        "Track how many unique characters are fully satisfied.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Sliding Window",
          complexity: { time: "O(m + n)", space: "O(m + n)" },
          code: {
            python: `def minWindow(s, t):
    if not t or not s:
        return ""

    # Count chars needed
    need = {}
    for c in t:
        need[c] = need.get(c, 0) + 1

    have = {}
    left = 0
    formed = 0  # unique chars with required count
    required = len(need)

    result = ""
    result_len = float('inf')

    for right in range(len(s)):
        char = s[right]
        have[char] = have.get(char, 0) + 1

        if char in need and have[char] == need[char]:
            formed += 1

        # Shrink window while valid
        while formed == required:
            # Update result
            if right - left + 1 < result_len:
                result_len = right - left + 1
                result = s[left:right + 1]

            # Shrink from left
            left_char = s[left]
            have[left_char] -= 1
            if left_char in need and have[left_char] < need[left_char]:
                formed -= 1
            left += 1

    return result`,
            javascript: `function minWindow(s, t) {
    if (!t || !s) return "";

    const need = {};
    for (const c of t) {
        need[c] = (need[c] || 0) + 1;
    }

    const have = {};
    let left = 0;
    let formed = 0;
    const required = Object.keys(need).length;

    let result = "";
    let resultLen = Infinity;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        have[char] = (have[char] || 0) + 1;

        if (need[char] && have[char] === need[char]) {
            formed++;
        }

        while (formed === required) {
            if (right - left + 1 < resultLen) {
                resultLen = right - left + 1;
                result = s.substring(left, right + 1);
            }

            const leftChar = s[left];
            have[leftChar]--;
            if (need[leftChar] && have[leftChar] < need[leftChar]) {
                formed--;
            }
            left++;
        }
    }

    return result;
}`,
          },
          explanation: "Expand until valid, shrink while valid tracking minimum, count satisfied unique chars.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def minWindow(s: str, t: str) -> str:
    # Your code here
    pass`,
        javascript: `function minWindow(s, t) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { s: "ADOBECODEBANC", t: "ABC" }, expected: "BANC" },
        { input: { s: "a", t: "a" }, expected: "a" },
        { input: { s: "a", t: "aa" }, expected: "" },
      ]),
    },
  });

  // ========================================
  // PATTERN 4: STACK
  // ========================================
  const stackPattern = await prismaClient.pattern.upsert({
    where: { slug: "stack" },
    update: {},
    create: {
      slug: "stack",
      title: "Stack",
      description: "LIFO data structure for matching pairs, parsing expressions, and tracking previous elements.",
      order: 4,
      topicId: fundamentalsTopic.id,
      explanation: `# Stack

## Core Concept

Stack = Last In, First Out (LIFO). Perfect for:
- Matching pairs (parentheses, tags)
- Tracking "previous" elements
- Reversing sequences
- Backtracking

## Common Use Cases

1. **Matching brackets**: Push open, pop and match on close
2. **Monotonic stack**: Maintain increasing/decreasing order
3. **Expression evaluation**: Operators and operands
4. **Undo operations**: Push actions, pop to undo

## The Pattern

\`\`\`python
def solve(s):
    stack = []

    for char in s:
        if is_opening(char):
            stack.append(char)
        else:
            if not stack or not matches(stack[-1], char):
                return False
            stack.pop()

    return len(stack) == 0
\`\`\`

## Key Insight

When you need to remember what came before and process in reverse order, think Stack.`,
      template: `def solve(s):
    stack = []

    for char in s:
        if should_push(char):
            stack.append(char)
        elif should_pop(char):
            if not stack:
                return False  # nothing to match
            top = stack.pop()
            if not matches(top, char):
                return False

    return len(stack) == 0`,
      isPremium: false,
    },
  });

  // Problem 4.1: Valid Parentheses
  await prismaClient.problem.upsert({
    where: { slug: "valid-parentheses" },
    update: { order: 1 },
    create: {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      order: 1,
      difficulty: "easy",
      patternId: stackPattern.id,
      estimatedMinutes: 15,
      description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
      constraints: `- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.`,
      examples: JSON.stringify([
        { input: 's = "()"', output: "true", explanation: "Simple matching pair." },
        { input: 's = "()[]{}"', output: "true", explanation: "Three matching pairs." },
        { input: 's = "(]"', output: "false", explanation: "Mismatched brackets." },
        { input: 's = "([)]"', output: "false", explanation: "Wrong order." },
      ]),
      hints: JSON.stringify([
        "Use a stack to track open brackets.",
        "Push open brackets onto stack.",
        "For close brackets, check if top of stack matches.",
        "At end, stack should be empty.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Stack",
          complexity: { time: "O(n)", space: "O(n)" },
          code: {
            python: `def isValid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in '({[':
            stack.append(char)
        else:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    return len(stack) == 0`,
            javascript: `function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };

    for (const char of s) {
        if ('({['.includes(char)) {
            stack.push(char);
        } else {
            if (!stack.length || stack[stack.length - 1] !== pairs[char]) {
                return false;
            }
            stack.pop();
        }
    }

    return stack.length === 0;
}`,
          },
          explanation: "Push open brackets. For close brackets, check if stack top matches. Stack empty at end = valid.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def isValid(s: str) -> bool:
    # Your code here
    pass`,
        javascript: `function isValid(s) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { s: "()" }, expected: true },
        { input: { s: "()[]{}" }, expected: true },
        { input: { s: "(]" }, expected: false },
        { input: { s: "([)]" }, expected: false },
      ]),
    },
  });

  // Problem 4.2: Min Stack
  await prismaClient.problem.upsert({
    where: { slug: "min-stack" },
    update: { order: 2 },
    create: {
      slug: "min-stack",
      title: "Min Stack",
      order: 2,
      difficulty: "medium",
      patternId: stackPattern.id,
      estimatedMinutes: 20,
      description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the \`MinStack\` class:
- \`MinStack()\` initializes the stack object.
- \`void push(int val)\` pushes the element val onto the stack.
- \`void pop()\` removes the element on the top of the stack.
- \`int top()\` gets the top element of the stack.
- \`int getMin()\` retrieves the minimum element in the stack.

You must implement a solution with O(1) time complexity for each function.`,
      constraints: `- -2^31 <= val <= 2^31 - 1
- Methods pop, top and getMin will always be called on non-empty stacks.
- At most 3 * 10^4 calls will be made to push, pop, top, and getMin.`,
      examples: JSON.stringify([
        {
          input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
          output: "[null,null,null,null,-3,null,0,-2]",
          explanation: "Push -2, 0, -3. Min is -3. Pop removes -3. Top is 0. Min is now -2.",
        },
      ]),
      hints: JSON.stringify([
        "How do you track minimum after a pop?",
        "Store the minimum at each level of the stack.",
        "Each element can be a pair: (value, min_at_this_level).",
        "Or use two stacks: one for values, one for minimums.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Two Stacks",
          complexity: { time: "O(1) all operations", space: "O(n)" },
          code: {
            python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        # Push min so far
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.min_stack[-1]`,
            javascript: `class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }

    push(val) {
        this.stack.push(val);
        const minVal = this.minStack.length
            ? Math.min(val, this.minStack[this.minStack.length - 1])
            : val;
        this.minStack.push(minVal);
    }

    pop() {
        this.stack.pop();
        this.minStack.pop();
    }

    top() {
        return this.stack[this.stack.length - 1];
    }

    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}`,
          },
          explanation: "Keep parallel stack of minimums. Each level stores the min up to that point.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `class MinStack:
    def __init__(self):
        pass

    def push(self, val: int) -> None:
        pass

    def pop(self) -> None:
        pass

    def top(self) -> int:
        pass

    def getMin(self) -> int:
        pass`,
        javascript: `class MinStack {
    constructor() {

    }

    push(val) {

    }

    pop() {

    }

    top() {

    }

    getMin() {

    }
}`,
      }),
      testCases: JSON.stringify([
        {
          input: { operations: ["MinStack", "push", "push", "push", "getMin", "pop", "top", "getMin"], args: [[], [-2], [0], [-3], [], [], [], []] },
          expected: [null, null, null, null, -3, null, 0, -2],
        },
      ]),
    },
  });

  // Problem 4.3: Daily Temperatures
  await prismaClient.problem.upsert({
    where: { slug: "daily-temperatures" },
    update: { order: 3 },
    create: {
      slug: "daily-temperatures",
      title: "Daily Temperatures",
      order: 3,
      difficulty: "medium",
      patternId: stackPattern.id,
      estimatedMinutes: 25,
      description: `Given an array of integers \`temperatures\` represents the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i-th\` day to get a warmer temperature. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.`,
      constraints: `- 1 <= temperatures.length <= 10^5
- 30 <= temperatures[i] <= 100`,
      examples: JSON.stringify([
        { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]", explanation: "Day 0: wait 1 day for 74. Day 2: wait 4 days for 76." },
        { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]", explanation: "Each day finds warmer next day except last." },
        { input: "temperatures = [30,60,90]", output: "[1,1,0]", explanation: "Strictly increasing." },
      ]),
      hints: JSON.stringify([
        "For each day, you need the next warmer day.",
        "Use a stack to track days waiting for warmer temperature.",
        "When you find a warmer day, pop all cooler days from stack.",
        "Store indices in stack, not temperatures.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Monotonic Stack",
          complexity: { time: "O(n)", space: "O(n)" },
          code: {
            python: `def dailyTemperatures(temperatures):
    n = len(temperatures)
    result = [0] * n
    stack = []  # indices of days waiting for warmer

    for i in range(n):
        # Pop all days that found their warmer day
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_day = stack.pop()
            result[prev_day] = i - prev_day

        stack.append(i)

    return result`,
            javascript: `function dailyTemperatures(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack = [];

    for (let i = 0; i < n; i++) {
        while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevDay = stack.pop();
            result[prevDay] = i - prevDay;
        }
        stack.push(i);
    }

    return result;
}`,
          },
          explanation: "Stack holds indices of days waiting. When warmer day found, pop and calculate days waited.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    # Your code here
    pass`,
        javascript: `function dailyTemperatures(temperatures) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, expected: [1, 1, 4, 2, 1, 1, 0, 0] },
        { input: { temperatures: [30, 40, 50, 60] }, expected: [1, 1, 1, 0] },
        { input: { temperatures: [30, 60, 90] }, expected: [1, 1, 0] },
      ]),
    },
  });

  // ========================================
  // PATTERN 5: BINARY SEARCH
  // ========================================
  const binarySearchPattern = await prismaClient.pattern.upsert({
    where: { slug: "binary-search" },
    update: {},
    create: {
      slug: "binary-search",
      title: "Binary Search",
      description: "O(log n) search in sorted data. Eliminate half the search space each step.",
      order: 5,
      topicId: fundamentalsTopic.id,
      explanation: `# Binary Search

## Core Concept

Divide and conquer on sorted data. Each step eliminates half the possibilities.

## Key Requirements

1. **Sorted data** (or monotonic property)
2. **Random access** (arrays, not linked lists)

## The Pattern

\`\`\`python
def binarySearch(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1  # not found
\`\`\`

## Variants

1. **Find exact value**: Standard binary search
2. **Find leftmost**: Keep searching left after finding
3. **Find rightmost**: Keep searching right after finding
4. **Search on answer**: Binary search on possible answers

## Key Insight

Any problem with a sorted or monotonic property can potentially use binary search.`,
      template: `def binarySearch(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2  # avoid overflow

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1  # search right half
        else:
            right = mid - 1  # search left half

    return -1`,
      isPremium: false,
    },
  });

  // Problem 5.1: Binary Search
  await prismaClient.problem.upsert({
    where: { slug: "binary-search" },
    update: { order: 1 },
    create: {
      slug: "binary-search",
      title: "Binary Search",
      order: 1,
      difficulty: "easy",
      patternId: binarySearchPattern.id,
      estimatedMinutes: 10,
      description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with O(log n) runtime complexity.`,
      constraints: `- 1 <= nums.length <= 10^4
- -10^4 < nums[i], target < 10^4
- All the integers in nums are unique.
- nums is sorted in ascending order.`,
      examples: JSON.stringify([
        { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
        { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums." },
      ]),
      hints: JSON.stringify([
        "Check the middle element.",
        "If target is larger, search the right half.",
        "If target is smaller, search the left half.",
        "Repeat until found or search space is empty.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Binary Search",
          complexity: { time: "O(log n)", space: "O(1)" },
          code: {
            python: `def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
            javascript: `function search(nums, target) {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);

        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}`,
          },
          explanation: "Classic binary search. Compare mid, eliminate half each step.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def search(nums: list[int], target: int) -> int:
    # Your code here
    pass`,
        javascript: `function search(nums, target) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: 4 },
        { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: -1 },
      ]),
    },
  });

  // Problem 5.2: Search in Rotated Sorted Array
  await prismaClient.problem.upsert({
    where: { slug: "search-in-rotated-sorted-array" },
    update: { order: 2 },
    create: {
      slug: "search-in-rotated-sorted-array",
      title: "Search in Rotated Sorted Array",
      order: 2,
      difficulty: "medium",
      patternId: binarySearchPattern.id,
      estimatedMinutes: 25,
      description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, \`nums\` is **possibly rotated** at an unknown pivot index \`k\` (1 <= k < nums.length) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\` (0-indexed).

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with O(log n) runtime complexity.`,
      constraints: `- 1 <= nums.length <= 5000
- -10^4 <= nums[i] <= 10^4
- All values of nums are unique.
- nums is an ascending array that is possibly rotated.
- -10^4 <= target <= 10^4`,
      examples: JSON.stringify([
        { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "0 is at index 4." },
        { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1", explanation: "3 is not in the array." },
        { input: "nums = [1], target = 0", output: "-1", explanation: "0 is not in the array." },
      ]),
      hints: JSON.stringify([
        "One half of the array is always sorted.",
        "Check which half is sorted by comparing nums[left] with nums[mid].",
        "If target is in the sorted half, search there. Otherwise, search the other half.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Modified Binary Search",
          complexity: { time: "O(log n)", space: "O(1)" },
          code: {
            python: `def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1`,
            javascript: `function search(nums, target) {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);

        if (nums[mid] === target) return mid;

        // Left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}`,
          },
          explanation: "Identify which half is sorted. If target in sorted half, search there. Otherwise search other half.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def search(nums: list[int], target: int) -> int:
    # Your code here
    pass`,
        javascript: `function search(nums, target) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, expected: 4 },
        { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, expected: -1 },
        { input: { nums: [1], target: 0 }, expected: -1 },
      ]),
    },
  });

  // Problem 5.3: Find Minimum in Rotated Sorted Array
  await prismaClient.problem.upsert({
    where: { slug: "find-minimum-in-rotated-sorted-array" },
    update: { order: 3 },
    create: {
      slug: "find-minimum-in-rotated-sorted-array",
      title: "Find Minimum in Rotated Sorted Array",
      order: 3,
      difficulty: "medium",
      patternId: binarySearchPattern.id,
      estimatedMinutes: 20,
      description: `Suppose an array of length \`n\` sorted in ascending order is **rotated** between \`1\` and \`n\` times. Given the sorted rotated array \`nums\` of **unique** elements, return the minimum element of this array.

You must write an algorithm that runs in O(log n) time.`,
      constraints: `- n == nums.length
- 1 <= n <= 5000
- -5000 <= nums[i] <= 5000
- All the integers of nums are unique.
- nums is sorted and rotated between 1 and n times.`,
      examples: JSON.stringify([
        { input: "nums = [3,4,5,1,2]", output: "1", explanation: "Original array was [1,2,3,4,5] rotated 3 times." },
        { input: "nums = [4,5,6,7,0,1,2]", output: "0", explanation: "Original array was [0,1,2,4,5,6,7] rotated 4 times." },
        { input: "nums = [11,13,15,17]", output: "11", explanation: "Not rotated, minimum is first element." },
      ]),
      hints: JSON.stringify([
        "The minimum is at the rotation point.",
        "If mid > right, rotation point is in right half.",
        "If mid < right, rotation point is in left half (including mid).",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Binary Search",
          complexity: { time: "O(log n)", space: "O(1)" },
          code: {
            python: `def findMin(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = left + (right - left) // 2

        if nums[mid] > nums[right]:
            # Min is in right half
            left = mid + 1
        else:
            # Min is in left half (including mid)
            right = mid

    return nums[left]`,
            javascript: `function findMin(nums) {
    let left = 0, right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor(left + (right - left) / 2);

        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return nums[left];
}`,
          },
          explanation: "Compare mid with right. If mid > right, min is after mid. Otherwise min is at or before mid.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def findMin(nums: list[int]) -> int:
    # Your code here
    pass`,
        javascript: `function findMin(nums) {
    // Your code here
}`,
      }),
      testCases: JSON.stringify([
        { input: { nums: [3, 4, 5, 1, 2] }, expected: 1 },
        { input: { nums: [4, 5, 6, 7, 0, 1, 2] }, expected: 0 },
        { input: { nums: [11, 13, 15, 17] }, expected: 11 },
      ]),
    },
  });

  console.log("✅ Curated lesson content seeded successfully!");
  console.log("   - 1 Topic: Fundamentals");
  console.log("   - 5 Patterns: Arrays & Hashing, Two Pointers, Sliding Window, Stack, Binary Search");
  console.log("   - 20 Essential Problems (curated from NeetCode 150)");
}

/**
 * Seed mock users for development
 */
export async function seedMockUsers(prismaClient: PrismaClient) {
  const paymentPlanIds = getSubscriptionPaymentPlanIds();
  const paymentPlanId = paymentPlanIds[0];

  const mockUsers: MockUserData[] = [
    {
      createdAt: faker.date.past(),
      email: "test@example.com",
      username: "testuser",
      displayName: "Test User",
      avatarUrl: null,
      isAdmin: false,
      subscriptionStatus: SubscriptionStatus.Active,
      subscriptionPlan: paymentPlanId,
      paymentProcessorUserId: `mock_${faker.string.uuid()}`,
      lemonSqueezyCustomerPortalUrl: null,
      datePaid: faker.date.past(),
      credits: 10,
      currentStreak: 5,
      longestStreak: 12,
      lastActiveDate: new Date(),
      totalXp: 1250,
      level: 8,
      preferredLanguage: "python",
      dailyGoal: 3,
    },
  ];

  for (const user of mockUsers) {
    await prismaClient.user.upsert({
      where: { email: user.email! },
      update: {},
      create: user,
    });
  }

  console.log("✅ Mock users seeded");
}

/**
 * Seed achievements
 */
export async function seedAchievements(prismaClient: PrismaClient) {
  const achievements = [
    {
      slug: "first-solve",
      title: "First Blood",
      description: "Solve your first problem",
      iconName: "Zap",
      xpReward: 50,
      criteria: JSON.stringify({ type: "problems_solved", count: 1 }),
      rarity: "common",
    },
    {
      slug: "streak-7",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      iconName: "Flame",
      xpReward: 100,
      criteria: JSON.stringify({ type: "streak", days: 7 }),
      rarity: "rare",
    },
    {
      slug: "pattern-master",
      title: "Pattern Master",
      description: "Complete all problems in a pattern",
      iconName: "Target",
      xpReward: 200,
      criteria: JSON.stringify({ type: "pattern_complete", count: 1 }),
      rarity: "epic",
    },
  ];

  for (const achievement of achievements) {
    await prismaClient.achievement.upsert({
      where: { slug: achievement.slug },
      update: {},
      create: achievement,
    });
  }

  console.log("✅ Achievements seeded");
}
