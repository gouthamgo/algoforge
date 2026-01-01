// Problem explanations - extracted for modularity
// Will be moved to database in future

export interface ExplanationSection {
  title: string;
  content: string;
  code?: string;
}

export interface ProblemExplanation {
  thinking: ExplanationSection[];
  approach: ExplanationSection[];
  walkthrough: ExplanationSection[];
}

export const EXPLANATIONS: Record<string, ProblemExplanation> = {
  "two-sum": {
    thinking: [
      {
        title: "What is the problem really asking?",
        content: `We have a list of numbers and a target sum. We need to find TWO numbers that add up to the target.

The key insight: if we pick any number from the list, we can calculate what the OTHER number needs to be.

For example, if target = 9 and we pick 2:
  → The other number must be 9 - 2 = 7

So the question becomes: "Is 7 anywhere in our list?"`,
      },
      {
        title: "Why is the brute force approach slow?",
        content: `The naive way: check every possible pair of numbers.

nums = [2, 7, 11, 15], target = 9

Check (2,7)  → 2+7=9  ✓ Found it!
Check (2,11) → 2+11=13
Check (2,15) → 2+15=17
Check (7,11) → 7+11=18
... and so on

This is O(n²) - for each number, we check every other number.
With 1000 numbers, that's ~1,000,000 operations!`,
      },
      {
        title: "The Hash Map Insight",
        content: `What if we could instantly check "is this number in the list?"

That's exactly what a hash map (dictionary) does - O(1) lookup!

Instead of:
  "Let me check every number to find 7" → O(n)

We get:
  "Is 7 in my hash map?" → O(1)

This turns O(n²) into O(n) - a massive speedup!`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Create an empty hash map to store {number: index}
2. Go through each number in the list
3. Calculate what number we NEED: complement = target - current
4. Check if that complement exists in our hash map
5. If yes → we found our pair!
6. If no → add current number to hash map and continue`,
      },
      {
        title: "Visual Walkthrough",
        content: `nums = [2, 7, 11, 15], target = 9

Step 1: num = 2
┌─────────────────────────────────────┐
│  complement = 9 - 2 = 7             │
│  Is 7 in hash map? NO (it's empty)  │
│  Add 2 to hash map: {2: 0}          │
└─────────────────────────────────────┘

Step 2: num = 7
┌─────────────────────────────────────┐
│  complement = 9 - 7 = 2             │
│  Is 2 in hash map? YES! at index 0  │
│  Return [0, 1] ✓                    │
└─────────────────────────────────────┘

We found it in just 2 steps!`,
      },
    ],
    walkthrough: [
      {
        title: "Building the Solution Step by Step",
        content: `Let's write this together, piece by piece:`,
        code: `def twoSum(nums, target):
    # Step 1: Create our hash map
    # Key = number, Value = its index
    seen = {}

    # Step 2: Go through each number with its index
    for i, num in enumerate(nums):

        # Step 3: What number do we need?
        complement = target - num

        # Step 4: Have we seen it before?
        if complement in seen:
            # Found it! Return both indices
            return [seen[complement], i]

        # Step 5: Remember this number for later
        seen[num] = i

    # No solution found (problem guarantees one exists)
    return []`,
      },
      {
        title: "Why This Works",
        content: `The magic is in the ORDER of operations:

1. We check BEFORE we add to the hash map
2. This means we only find numbers that came BEFORE us
3. So we never return the same index twice

Time Complexity: O(n) - we visit each number once
Space Complexity: O(n) - hash map stores up to n numbers`,
      },
      {
        title: "Common Mistakes to Avoid",
        content: `❌ Returning the same index twice
   → We check for complement BEFORE adding current number

❌ Forgetting to store the INDEX (not just the number)
   → We need indices for the answer, so store {num: index}

❌ Using a list instead of a dict for lookup
   → List lookup is O(n), dict lookup is O(1)`,
      },
    ],
  },

  "valid-anagram": {
    thinking: [
      {
        title: "What makes two words anagrams?",
        content: `An anagram uses the EXACT same letters, just rearranged.

"listen" → "silent"  ✓ Same letters, different order
"hello"  → "world"   ✗ Different letters

Key insight: Two strings are anagrams if they have the
SAME CHARACTER COUNTS.

"listen": l=1, i=1, s=1, t=1, e=1, n=1
"silent": s=1, i=1, l=1, e=1, n=1, t=1

Same counts = anagram!`,
      },
      {
        title: "Why not just sort and compare?",
        content: `Sorting works! If we sort both strings, anagrams become identical:

sort("listen") → "eilnst"
sort("silent") → "eilnst"
Same! ✓

But sorting is O(n log n). Can we do better?

Yes! Counting characters is O(n).
We trade a bit of space for speed.`,
      },
      {
        title: "The Counting Approach",
        content: `Think of it like inventory management:

1. Count all items in warehouse A (first string)
2. Remove items as we find them in warehouse B (second string)
3. If inventory is zero at the end → same items!

Or simpler: count string 1, count string 2, compare counts.

Python makes this easy with Counter or a dictionary.`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `Method 1: Two Counter comparison
1. Count characters in string s
2. Count characters in string t
3. Compare the two counts
4. If equal → anagram!

Method 2: Single Counter (more efficient)
1. Count UP for each char in s
2. Count DOWN for each char in t
3. If all counts are 0 → anagram!`,
      },
      {
        title: "Visual Walkthrough",
        content: `s = "anagram", t = "nagaram"

Building character count for s:
┌─────────────────────────────────┐
│  a: 3, n: 1, g: 1, r: 1, m: 1   │
└─────────────────────────────────┘

Building character count for t:
┌─────────────────────────────────┐
│  n: 1, a: 3, g: 1, r: 1, m: 1   │
└─────────────────────────────────┘

Compare: Both have same counts → True!`,
      },
    ],
    walkthrough: [
      {
        title: "Solution 1: Using Counter",
        content: `The cleanest Python solution:`,
        code: `from collections import Counter

def isAnagram(s: str, t: str) -> bool:
    # Counter creates a dict of char counts
    # Just compare them directly!
    return Counter(s) == Counter(t)`,
      },
      {
        title: "Solution 2: Manual Counting",
        content: `If you want to understand what Counter does:`,
        code: `def isAnagram(s: str, t: str) -> bool:
    # Quick length check - must be same length
    if len(s) != len(t):
        return False

    # Count characters in both strings
    count_s = {}
    count_t = {}

    for char in s:
        count_s[char] = count_s.get(char, 0) + 1

    for char in t:
        count_t[char] = count_t.get(char, 0) + 1

    return count_s == count_t`,
      },
      {
        title: "Why This Works",
        content: `Time Complexity: O(n) - we look at each character once
Space Complexity: O(1) - at most 26 letters (fixed alphabet)

The length check is a quick optimization:
- Different lengths → can't be anagrams
- Saves us from counting when answer is obvious

Note: For Unicode strings, space could be O(n)
since there are many possible characters.`,
      },
    ],
  },

  "contains-duplicate": {
    thinking: [
      {
        title: "What are we really looking for?",
        content: `We need to find if ANY number appears more than once.

[1, 2, 3, 1] → True (1 appears twice)
[1, 2, 3, 4] → False (all unique)

The question is: how do we efficiently check
"have I seen this number before?"`,
      },
      {
        title: "Why a Set is perfect here",
        content: `A Set is a collection that:
- Only stores UNIQUE values
- Has O(1) lookup time

If we try to add a duplicate to a set... nothing happens!
The set stays the same size.

So: if set size < list size → there were duplicates!

Or: check "is this in the set?" before adding each number.`,
      },
      {
        title: "Comparing Approaches",
        content: `Approach 1: Brute Force
Check every pair of numbers. O(n²) - too slow!

Approach 2: Sort first
Duplicates will be adjacent. O(n log n)

Approach 3: Use a Set
Check and add in one pass. O(n) ✓

The set approach wins because lookup is instant.`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Create an empty set (our "seen" tracker)
2. Go through each number in the list
3. If number is already in set → return True (duplicate!)
4. Otherwise, add number to set
5. If we finish the loop → return False (no duplicates)`,
      },
      {
        title: "Visual Walkthrough",
        content: `nums = [1, 2, 3, 1]

Step 1: num = 1
┌──────────────────────────────┐
│  Is 1 in set {}? NO          │
│  Add 1 → set = {1}           │
└──────────────────────────────┘

Step 2: num = 2
┌──────────────────────────────┐
│  Is 2 in set {1}? NO         │
│  Add 2 → set = {1, 2}        │
└──────────────────────────────┘

Step 3: num = 3
┌──────────────────────────────┐
│  Is 3 in set {1, 2}? NO      │
│  Add 3 → set = {1, 2, 3}     │
└──────────────────────────────┘

Step 4: num = 1
┌──────────────────────────────┐
│  Is 1 in set {1, 2, 3}? YES! │
│  Return True (duplicate!)    │
└──────────────────────────────┘`,
      },
    ],
    walkthrough: [
      {
        title: "Clean One-Liner",
        content: `Python sets automatically remove duplicates:`,
        code: `def containsDuplicate(nums: list[int]) -> bool:
    # If set is smaller than list, duplicates existed
    return len(set(nums)) < len(nums)`,
      },
      {
        title: "Explicit Loop Version",
        content: `More readable and stops early when duplicate found:`,
        code: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()

    for num in nums:
        # Already seen this number?
        if num in seen:
            return True
        # Remember this number
        seen.add(num)

    # Went through all numbers, no duplicates
    return False`,
      },
      {
        title: "Why This Works",
        content: `Time Complexity: O(n) - visit each number once
Space Complexity: O(n) - set could hold all numbers

The explicit loop is often better because:
- It stops as soon as it finds a duplicate
- Best case: O(1) if duplicate is at start
- The one-liner always processes ALL elements

Both are valid - choose based on your preference!`,
      },
    ],
  },

  "group-anagrams": {
    thinking: [
      {
        title: "What's the connection to Valid Anagram?",
        content: `We already know how to check if two words are anagrams:
they have the same character counts.

Now we need to GROUP all anagrams together.

["eat", "tea", "ate"] → all anagrams of each other
["tan", "nat"] → anagrams of each other
["bat"] → alone, no anagrams

The key: we need a way to identify "anagram groups"`,
      },
      {
        title: "Finding the Group Identity",
        content: `How do we know which group a word belongs to?

Option 1: Sort the word
  "eat" → "aet"
  "tea" → "aet"
  "ate" → "aet"
  All sort to "aet" → same group!

Option 2: Character count tuple
  "eat" → (a=1, e=1, t=1)
  "tea" → (a=1, e=1, t=1)
  Same counts → same group!

Both work! Sorting is simpler to implement.`,
      },
      {
        title: "Using a Hash Map for Grouping",
        content: `We use a dict where:
- KEY = the sorted word (group identifier)
- VALUE = list of original words in that group

As we process each word:
1. Sort it to get the key
2. Add original word to that key's list

At the end, return all the lists!`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Create empty dict: {sorted_word: [original_words]}
2. For each word in the input:
   a. Sort the word to get its "signature"
   b. Add original word to that signature's list
3. Return all the lists (dict.values())`,
      },
      {
        title: "Visual Walkthrough",
        content: `strs = ["eat", "tea", "tan", "ate", "nat", "bat"]

Processing each word:
┌─────────────────────────────────────────┐
│ "eat" → sorted: "aet"                   │
│ groups = {"aet": ["eat"]}               │
├─────────────────────────────────────────┤
│ "tea" → sorted: "aet"                   │
│ groups = {"aet": ["eat", "tea"]}        │
├─────────────────────────────────────────┤
│ "tan" → sorted: "ant"                   │
│ groups = {"aet": ["eat", "tea"],        │
│           "ant": ["tan"]}               │
├─────────────────────────────────────────┤
│ "ate" → sorted: "aet"                   │
│ groups = {"aet": ["eat", "tea", "ate"], │
│           "ant": ["tan"]}               │
├─────────────────────────────────────────┤
│ "nat" → sorted: "ant"                   │
│ groups = {"aet": ["eat", "tea", "ate"], │
│           "ant": ["tan", "nat"]}        │
├─────────────────────────────────────────┤
│ "bat" → sorted: "abt"                   │
│ groups = {"aet": [...], "ant": [...],   │
│           "abt": ["bat"]}               │
└─────────────────────────────────────────┘

Return: [["eat","tea","ate"], ["tan","nat"], ["bat"]]`,
      },
    ],
    walkthrough: [
      {
        title: "Solution with defaultdict",
        content: `defaultdict automatically creates empty lists:`,
        code: `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Key: sorted string, Value: list of anagrams
    groups = defaultdict(list)

    for word in strs:
        # Sort word to get its "signature"
        key = ''.join(sorted(word))
        # Add to its group
        groups[key].append(word)

    # Return all groups as a list
    return list(groups.values())`,
      },
      {
        title: "Solution without defaultdict",
        content: `If you prefer explicit dict handling:`,
        code: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = {}

    for word in strs:
        key = ''.join(sorted(word))

        # Create list if key doesn't exist
        if key not in groups:
            groups[key] = []

        groups[key].append(word)

    return list(groups.values())`,
      },
      {
        title: "Complexity Analysis",
        content: `Let n = number of strings, k = max string length

Time: O(n * k * log k)
- We process n strings
- Sorting each string takes O(k log k)

Space: O(n * k)
- We store all strings in the groups dict

Alternative approach using character counts:
- Time: O(n * k) - no sorting needed
- But implementation is more complex
- Sorting is fast enough for most cases!`,
      },
    ],
  },

  "top-k-frequent-elements": {
    thinking: [
      {
        title: "Breaking down the problem",
        content: `We need to find the k MOST frequent numbers.

nums = [1,1,1,2,2,3], k = 2

Count frequencies:
  1 appears 3 times
  2 appears 2 times
  3 appears 1 time

Top 2 most frequent: [1, 2]

Two steps:
1. Count frequencies
2. Find top k`,
      },
      {
        title: "How to find the top k?",
        content: `After counting, we have: {1: 3, 2: 2, 3: 1}

Option 1: Sort by frequency → O(n log n)
Option 2: Use a Heap → O(n log k)
Option 3: Bucket Sort → O(n) ✓

Bucket Sort insight:
- Max possible frequency = n (length of array)
- Create n buckets, one for each frequency
- Bucket[freq] = list of numbers with that frequency
- Read buckets from highest to lowest`,
      },
      {
        title: "The Bucket Sort Trick",
        content: `nums = [1,1,1,2,2,3]

Frequencies: {1: 3, 2: 2, 3: 1}

Create buckets (index = frequency):
┌─────────────────────────────────┐
│ bucket[0] = []     (0 times)    │
│ bucket[1] = [3]    (1 time)     │
│ bucket[2] = [2]    (2 times)    │
│ bucket[3] = [1]    (3 times)    │
│ bucket[4] = []     (4 times)    │
│ bucket[5] = []     (5 times)    │
│ bucket[6] = []     (6 times)    │
└─────────────────────────────────┘

Read from right to left, take k elements!`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Count frequency of each number (hash map)
2. Create buckets: bucket[i] = numbers appearing i times
3. Iterate buckets from highest frequency down
4. Collect numbers until we have k elements`,
      },
      {
        title: "Visual Walkthrough",
        content: `nums = [1,1,1,2,2,3], k = 2

Step 1: Count frequencies
┌─────────────────────────────────┐
│ count = {1: 3, 2: 2, 3: 1}      │
└─────────────────────────────────┘

Step 2: Fill buckets
┌─────────────────────────────────┐
│ index:  0    1    2    3        │
│ bucket: []  [3]  [2]  [1]       │
└─────────────────────────────────┘

Step 3: Collect from right to left
┌─────────────────────────────────┐
│ bucket[3] = [1] → result = [1]  │
│ bucket[2] = [2] → result = [1,2]│
│ len(result) = k = 2 → DONE!     │
└─────────────────────────────────┘

Answer: [1, 2]`,
      },
    ],
    walkthrough: [
      {
        title: "Bucket Sort Solution",
        content: `The optimal O(n) solution:`,
        code: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    # Step 1: Count frequencies
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1

    # Step 2: Create buckets
    # bucket[i] = list of numbers with frequency i
    buckets = [[] for _ in range(len(nums) + 1)]

    for num, freq in count.items():
        buckets[freq].append(num)

    # Step 3: Collect top k from right to left
    result = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            result.append(num)
            if len(result) == k:
                return result

    return result`,
      },
      {
        title: "Using Counter (Simpler but O(n log n))",
        content: `Python's Counter has a handy method:`,
        code: `from collections import Counter

def topKFrequent(nums: list[int], k: int) -> list[int]:
    count = Counter(nums)
    # most_common returns [(element, count), ...]
    return [num for num, freq in count.most_common(k)]`,
      },
      {
        title: "Complexity Analysis",
        content: `Bucket Sort:
- Time: O(n) - count + fill buckets + collect
- Space: O(n) - buckets could hold n elements

Counter.most_common:
- Time: O(n log n) - sorting happens internally
- Space: O(n) - for the counter

Why bucket sort works in O(n):
- We know frequencies are bounded by n
- So we can use array indices instead of sorting
- This is called "counting sort" principle!`,
      },
    ],
  },

  "product-of-array-except-self": {
    thinking: [
      {
        title: "Understanding the problem",
        content: `For each position, multiply ALL other numbers.

nums = [1, 2, 3, 4]

answer[0] = 2 * 3 * 4 = 24  (everything except 1)
answer[1] = 1 * 3 * 4 = 12  (everything except 2)
answer[2] = 1 * 2 * 4 = 8   (everything except 3)
answer[3] = 1 * 2 * 3 = 6   (everything except 4)

Catch: Can't use division! (Otherwise we'd just
compute total product and divide by each number)`,
      },
      {
        title: "The Key Insight: Prefix and Suffix",
        content: `For each index, the answer is:
(product of everything LEFT) × (product of everything RIGHT)

nums = [1, 2, 3, 4]
        ↑
For index 2 (value 3):
  Left product:  1 × 2 = 2
  Right product: 4 = 4
  Answer: 2 × 4 = 8 ✓

We can precompute these products!`,
      },
      {
        title: "Building Prefix and Suffix Products",
        content: `nums = [1, 2, 3, 4]

Prefix products (left to right):
  prefix[0] = 1 (nothing to the left)
  prefix[1] = 1
  prefix[2] = 1 × 2 = 2
  prefix[3] = 1 × 2 × 3 = 6

Suffix products (right to left):
  suffix[3] = 1 (nothing to the right)
  suffix[2] = 4
  suffix[1] = 4 × 3 = 12
  suffix[0] = 4 × 3 × 2 = 24

Answer[i] = prefix[i] × suffix[i]`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Build prefix products (left cumulative product)
2. Build suffix products (right cumulative product)
3. Multiply prefix[i] × suffix[i] for each position

Optimization: We can do this with O(1) extra space
by using the output array cleverly!`,
      },
      {
        title: "Visual Walkthrough",
        content: `nums = [1, 2, 3, 4]

Step 1: Build prefix products in output array
┌─────────────────────────────────────────┐
│ output = [1, 1, 2, 6]                   │
│           ↑  ↑  ↑  ↑                    │
│           │  │  │  └─ 1×2×3             │
│           │  │  └──── 1×2               │
│           │  └─────── 1                 │
│           └────────── 1 (start)         │
└─────────────────────────────────────────┘

Step 2: Multiply suffix products (right to left)
┌─────────────────────────────────────────┐
│ suffix starts at 1                      │
│                                         │
│ i=3: output[3] = 6 × 1 = 6              │
│      suffix = 1 × 4 = 4                 │
│                                         │
│ i=2: output[2] = 2 × 4 = 8              │
│      suffix = 4 × 3 = 12                │
│                                         │
│ i=1: output[1] = 1 × 12 = 12            │
│      suffix = 12 × 2 = 24               │
│                                         │
│ i=0: output[0] = 1 × 24 = 24            │
└─────────────────────────────────────────┘

Final: output = [24, 12, 8, 6] ✓`,
      },
    ],
    walkthrough: [
      {
        title: "Two-Pass Solution (O(1) Space)",
        content: `Build prefix in output, then multiply suffix:`,
        code: `def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    output = [1] * n

    # Pass 1: Build prefix products in output
    prefix = 1
    for i in range(n):
        output[i] = prefix
        prefix *= nums[i]

    # Pass 2: Multiply by suffix products
    suffix = 1
    for i in range(n - 1, -1, -1):
        output[i] *= suffix
        suffix *= nums[i]

    return output`,
      },
      {
        title: "Step-by-Step Trace",
        content: `nums = [1, 2, 3, 4]

Pass 1 (prefix):
┌────┬──────────┬──────────┬─────────────┐
│ i  │ output[i]│ prefix   │ after       │
├────┼──────────┼──────────┼─────────────┤
│ 0  │ 1        │ 1        │ 1×1=1       │
│ 1  │ 1        │ 1        │ 1×2=2       │
│ 2  │ 2        │ 2        │ 2×3=6       │
│ 3  │ 6        │ 6        │ 6×4=24      │
└────┴──────────┴──────────┴─────────────┘
output = [1, 1, 2, 6]

Pass 2 (suffix, right to left):
┌────┬──────────┬──────────┬─────────────┐
│ i  │ output[i]│ suffix   │ after       │
├────┼──────────┼──────────┼─────────────┤
│ 3  │ 6×1=6    │ 1        │ 1×4=4       │
│ 2  │ 2×4=8    │ 4        │ 4×3=12      │
│ 1  │ 1×12=12  │ 12       │ 12×2=24     │
│ 0  │ 1×24=24  │ 24       │ -           │
└────┴──────────┴──────────┴─────────────┘
output = [24, 12, 8, 6] ✓`,
      },
      {
        title: "Why This Works",
        content: `Time Complexity: O(n) - two passes through the array
Space Complexity: O(1) - output array doesn't count!

The trick is we're computing:
  output[i] = prefix[i] × suffix[i]

But instead of storing both arrays:
- First pass stores prefix in output
- Second pass multiplies suffix on-the-fly

No division needed! Each element sees products
of all OTHER elements through prefix and suffix.`,
      },
    ],
  },

  "valid-sudoku": {
    thinking: [
      {
        title: "What Makes Sudoku Valid?",
        content: `Three rules must be satisfied:

1. Each ROW has digits 1-9 without repetition
2. Each COLUMN has digits 1-9 without repetition
3. Each 3x3 BOX has digits 1-9 without repetition

We're NOT solving the puzzle - just checking if the
current state is valid (no conflicts so far).

Empty cells '.' are ignored.`,
      },
      {
        title: "The Challenge: Efficient Checking",
        content: `Brute force: For each cell, check its row, column, and box
→ O(81 × 9 × 3) = O(2187) checks

Better approach: Use hash sets!
- One set per row (9 sets)
- One set per column (9 sets)
- One set per 3x3 box (9 sets)

As we scan, add each number to its row/col/box sets.
If we try to add a duplicate → Invalid!`,
      },
      {
        title: "The Box Index Trick",
        content: `How do we know which 3x3 box a cell belongs to?

    Boxes are numbered 0-8:
    ┌───┬───┬───┐
    │ 0 │ 1 │ 2 │
    ├───┼───┼───┤
    │ 3 │ 4 │ 5 │
    ├───┼───┼───┤
    │ 6 │ 7 │ 8 │
    └───┴───┴───┘

For cell at (row, col):
  box_index = (row // 3) * 3 + (col // 3)

Example: (4, 7) → (1) * 3 + (2) = 5 ✓`,
      },
    ],
    approach: [
      {
        title: "Hash Set Approach",
        content: `Algorithm:

1. Create 9 sets for rows, 9 for cols, 9 for boxes
2. For each cell (r, c):
   - Skip if empty '.'
   - Get box index: (r // 3) * 3 + (c // 3)
   - If num in rows[r] OR cols[c] OR boxes[box]: Invalid!
   - Add num to all three sets
3. If we finish without duplicates → Valid!

    ┌───────────────────────────┐
    │  Check rows[r]            │
    │  Check cols[c]            │──→ Any duplicate? INVALID
    │  Check boxes[box_idx]     │
    └───────────────────────────┘`,
      },
      {
        title: "Alternative: Tuple in Single Set",
        content: `Instead of 27 sets, use ONE set with encoded tuples:

For number '5' at row 2, col 3:
- Add ('row', 2, '5')
- Add ('col', 3, '5')
- Add ('box', 0, '5')

If any tuple already exists → Invalid!

This is cleaner but uses same O(81) space.`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Here's the hash set approach:`,
        code: `def isValidSudoku(board: list[list[str]]) -> bool:
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]

    for r in range(9):
        for c in range(9):
            num = board[r][c]
            if num == '.':
                continue

            box_idx = (r // 3) * 3 + (c // 3)

            # Check for duplicates
            if num in rows[r] or num in cols[c] or num in boxes[box_idx]:
                return False

            # Add to all three sets
            rows[r].add(num)
            cols[c].add(num)
            boxes[box_idx].add(num)

    return True`,
      },
      {
        title: "Visual Example",
        content: `Processing cell (1, 4) with value '9':

    Board:                    Sets after:
    5 3 . │ . 7 . │ . . .     rows[1] = {6, 9}
    6 . . │ 1 9 5 │ . . .     cols[4] = {7, 9}
    . 9 8 │ . . . │ . 6 .     boxes[1] = {1, 5, 9}
    ──────┼───────┼──────
    ...

    box_idx = (1 // 3) * 3 + (4 // 3)
            = 0 * 3 + 1 = 1

    Check: '9' not in any set → OK
    Add '9' to rows[1], cols[4], boxes[1]`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(81) = O(1)
- Fixed 9×9 board
- Each cell: O(1) set operations
- Total: 81 × O(1) = O(1)

Space: O(81) = O(1)
- 27 sets × at most 9 elements each
- Or 81 elements in single set approach
- Fixed size, so O(1)

Both time and space are constant because
the Sudoku board is always 9×9!`,
      },
    ],
  },

  "longest-consecutive-sequence": {
    thinking: [
      {
        title: "Understanding the Problem",
        content: `Find the length of the longest consecutive sequence.

nums = [100, 4, 200, 1, 3, 2]
Answer: 4 (the sequence 1, 2, 3, 4)

Key constraint: Must be O(n) time!
- Sorting would be O(n log n) ❌
- We need a smarter approach`,
      },
      {
        title: "The Key Insight",
        content: `Use a set for O(1) lookups!

For each number, we could check if it's the START
of a sequence by checking: is (num - 1) in the set?

If (num - 1) exists → num is NOT the start
If (num - 1) doesn't exist → num IS the start!

Only count sequence length from starts.
This prevents counting the same sequence multiple times.`,
      },
      {
        title: "Why This is O(n)",
        content: `It looks like nested loops = O(n²), but...

Each number is visited at most TWICE:
1. Once when checking if it's a start
2. Once when being counted in a sequence

Example: [1, 2, 3, 4]
- Check 1: start? yes (0 not in set) → count 1,2,3,4
- Check 2: start? no (1 in set) → skip
- Check 3: start? no (2 in set) → skip
- Check 4: start? no (3 in set) → skip

Total work: n + n = O(n)`,
      },
    ],
    approach: [
      {
        title: "Set-Based O(n) Solution",
        content: `Algorithm:

1. Put all numbers in a set (O(n))
2. For each number:
   - If (num-1) in set: skip (not a start)
   - If (num-1) not in set: count sequence length
3. Track maximum length

    nums = [100, 4, 200, 1, 3, 2]
    set = {100, 4, 200, 1, 3, 2}

    100: 99 not in set → start! count: 1
    4:   3 in set → skip
    200: 199 not in set → start! count: 1
    1:   0 not in set → start! count: 1,2,3,4 = 4 ★
    3:   2 in set → skip
    2:   1 in set → skip

    Answer: 4`,
      },
      {
        title: "Counting a Sequence",
        content: `Once we find a start, count up:

    start = 1
    current = 1

    while current in set:
        current += 1
        length += 1

    1 in set ✓ → length=1, current=2
    2 in set ✓ → length=2, current=3
    3 in set ✓ → length=3, current=4
    4 in set ✓ → length=4, current=5
    5 not in set → stop

    Sequence length = 4`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Here's the O(n) solution:`,
        code: `def longestConsecutive(nums: list[int]) -> int:
    num_set = set(nums)
    longest = 0

    for num in num_set:
        # Only start counting from sequence starts
        if num - 1 not in num_set:
            current = num
            length = 1

            while current + 1 in num_set:
                current += 1
                length += 1

            longest = max(longest, length)

    return longest`,
      },
      {
        title: "Why Iterate Over Set?",
        content: `We iterate over num_set, not nums. Why?

nums might have duplicates: [1, 2, 2, 3]
set removes duplicates: {1, 2, 3}

This ensures we don't process duplicates
and keeps our O(n) guarantee.

Also: set lookup is O(1) average,
so all our "in set" checks are fast!`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Build set: O(n)
- Main loop: O(n) total work
  - Each number checked as potential start: O(n)
  - Each number counted in sequence at most once: O(n)
  - Total: O(n) + O(n) = O(n)

Space: O(n)
- Set stores all unique numbers

This is optimal! We must see each number at least once.`,
      },
    ],
  },

  "encode-decode-strings": {
    thinking: [
      {
        title: "The Challenge",
        content: `Encode a list of strings into ONE string,
then decode it back to the original list.

["hello", "world"] → "?????????" → ["hello", "world"]

The tricky part: strings can contain ANY character!
Including spaces, commas, special characters...

Simple delimiters won't work:
- Using comma: "a,b" and ["a,b"] look the same!
- Using space: "a b" and ["a b"] look the same!`,
      },
      {
        title: "The Length-Prefix Solution",
        content: `Instead of delimiters, use LENGTH prefixes!

Format: length + delimiter + string

"hello" → "5#hello"
"world" → "5#world"
["hello", "world"] → "5#hello5#world"

Decoding:
1. Read digits until #
2. Parse length (5)
3. Read exactly 5 characters ("hello")
4. Repeat

This works for ANY string content!`,
      },
      {
        title: "Why # as Delimiter?",
        content: `We need a delimiter between length and content.

"5hello" is ambiguous:
- Is it "5" + "hello"?
- Or "5hell" + "o"?

"5#hello" is unambiguous:
- Read digits: "5"
- Hit #: now we know length is 5
- Read 5 chars: "hello"

Any non-digit char works, but # is common.`,
      },
    ],
    approach: [
      {
        title: "Encoding Algorithm",
        content: `For each string, prepend length + "#":

def encode(strs):
    result = ""
    for s in strs:
        result += str(len(s)) + "#" + s
    return result

Example:
["hello", "world", ""]
→ "5#hello" + "5#world" + "0#"
→ "5#hello5#world0#"

Empty string becomes "0#" (length 0, no content)`,
      },
      {
        title: "Decoding Algorithm",
        content: `Parse length, read that many chars, repeat:

    "5#hello5#world0#"
     ↑
     Start at position 0

    Step 1: Read "5", skip "#", read 5 chars → "hello"
    Step 2: Read "5", skip "#", read 5 chars → "world"
    Step 3: Read "0", skip "#", read 0 chars → ""

    Result: ["hello", "world", ""]

Key: We KNOW exactly how many chars to read,
so we can't be confused by special characters!`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Here's the encode/decode implementation:`,
        code: `def encode(strs: list[str]) -> str:
    result = ""
    for s in strs:
        result += str(len(s)) + "#" + s
    return result

def decode(s: str) -> list[str]:
    result = []
    i = 0

    while i < len(s):
        # Find the # delimiter
        j = i
        while s[j] != '#':
            j += 1

        # Parse the length
        length = int(s[i:j])

        # Extract the string (starts after #)
        start = j + 1
        result.append(s[start:start + length])

        # Move to next encoded string
        i = start + length

    return result`,
      },
      {
        title: "Trace: Decode \"5#hello5#world\"",
        content: `s = "5#hello5#world"

    i=0: Find # at j=1
         length = int("5") = 5
         start = 2
         Extract s[2:7] = "hello"
         i = 7

    i=7: Find # at j=8
         length = int("5") = 5
         start = 9
         Extract s[9:14] = "world"
         i = 14

    i=14: i >= len(s), stop

    Result: ["hello", "world"] ✓`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n) where n = total characters
- Encode: Visit each character once
- Decode: Visit each character once

Space: O(1) extra (not counting output)
- Just tracking indices

Edge cases handled:
- Empty strings: "0#" works
- Strings with #: "3#a#b" → length 3, content "a#b"
- Strings with digits: "3#123" → length 3, content "123"

This is a common interview problem at Meta!`,
      },
    ],
  },

  // ==========================================
  // TWO POINTERS PROBLEMS
  // ==========================================

  "valid-palindrome": {
    thinking: [
      {
        title: "What is a palindrome?",
        content: `A palindrome reads the same forwards and backwards.

"racecar" → forwards: racecar, backwards: racecar ✓
"hello"   → forwards: hello, backwards: olleh ✗

But this problem has a twist:
- Ignore non-alphanumeric characters (spaces, punctuation)
- Ignore case (A = a)

"A man, a plan, a canal: Panama"
→ Clean up: "amanaplanacanalpanama"
→ Check: reads same both ways ✓`,
      },
      {
        title: "The Two Pointer Approach",
        content: `Instead of cleaning the string first (uses O(n) space),
we can use two pointers and skip invalid characters!

  "A man, a plan..."
   ↑              ↑
  left          right

Compare characters, skip non-alphanumeric.
Move pointers toward each other.
If any mismatch → not a palindrome.`,
      },
      {
        title: "Why Two Pointers Work Here",
        content: `Palindrome property: char at position i must match
char at position (n-1-i).

Instead of checking all pairs separately:
- Start from both ends
- Work toward the middle
- Stop when pointers meet or cross

This gives us O(n) time with O(1) space!`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Initialize left pointer at start, right at end
2. While left < right:
   a. Skip non-alphanumeric from left
   b. Skip non-alphanumeric from right
   c. Compare (case-insensitive)
   d. If mismatch → return False
   e. Move both pointers inward
3. If loop completes → return True`,
      },
      {
        title: "Visual Walkthrough",
        content: `s = "A man, a plan, a canal: Panama"

Step 1: Skip spaces/punctuation, compare A and a
┌────────────────────────────────────┐
│ "A man, a plan, a canal: Panama"  │
│  ↑                            ↑   │
│  A                            a   │
│  A.lower() == a.lower() ✓         │
└────────────────────────────────────┘

Step 2: Move inward, skip comma, compare m and m
┌────────────────────────────────────┐
│ "A man, a plan, a canal: Panama"  │
│    ↑                        ↑     │
│    m                        m     │
│    Match! ✓                       │
└────────────────────────────────────┘

... continue until pointers meet ...

All matched → True!`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Clean and simple two-pointer approach:`,
        code: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1

    while left < right:
        # Skip non-alphanumeric from left
        while left < right and not s[left].isalnum():
            left += 1

        # Skip non-alphanumeric from right
        while left < right and not s[right].isalnum():
            right -= 1

        # Compare (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True`,
      },
      {
        title: "Key Python Methods",
        content: `str.isalnum() - Returns True if alphanumeric
  "a".isalnum() → True
  "1".isalnum() → True
  " ".isalnum() → False
  ",".isalnum() → False

str.lower() - Converts to lowercase
  "A".lower() → "a"
  "a".lower() → "a"

Using these avoids manual ASCII checks!`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Each character is visited at most once
- Left pointer only moves right
- Right pointer only moves left

Space: O(1)
- Only using two pointer variables
- No extra string or array created

Compare to the naive approach:
- Create cleaned string: O(n) space
- Then check palindrome: O(n) time
- Total: O(n) time, O(n) space

Two pointers saves space!`,
      },
    ],
  },

  "two-sum-ii": {
    thinking: [
      {
        title: "How is this different from Two Sum?",
        content: `Two Sum: unsorted array, use hash map → O(n) time, O(n) space
Two Sum II: SORTED array, use two pointers → O(n) time, O(1) space!

The sorted property is the key insight.

When array is sorted:
- Smallest values are on the left
- Largest values are on the right
- We can make informed decisions about which pointer to move`,
      },
      {
        title: "The Two Pointer Logic",
        content: `Start with pointers at both ends:

numbers = [2, 7, 11, 15], target = 9
           ↑          ↑
          left      right
          sum = 2 + 15 = 17 (too big!)

If sum is too big → move right pointer left (smaller number)
If sum is too small → move left pointer right (bigger number)
If sum equals target → found it!

This works because the array is sorted!`,
      },
      {
        title: "Why This Approach is Correct",
        content: `Can we miss the answer? No!

When we move a pointer, we eliminate possibilities
that CAN'T be the answer.

If sum > target and we move right pointer left:
- We're saying "right + left is too big"
- So right + (anything ≥ left) is also too big
- We can safely skip all those pairs!

Same logic for moving left pointer right.
We'll eventually find the pair if it exists.`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. left = 0 (start), right = n-1 (end)
2. While left < right:
   a. Calculate sum = numbers[left] + numbers[right]
   b. If sum == target → return [left+1, right+1]
   c. If sum < target → left += 1 (need bigger)
   d. If sum > target → right -= 1 (need smaller)
3. Problem guarantees a solution, so we'll find it`,
      },
      {
        title: "Visual Walkthrough",
        content: `numbers = [2, 7, 11, 15], target = 9

Step 1:
┌─────────────────────────────────┐
│ [2,  7,  11,  15]               │
│  ↑           ↑                  │
│ left       right                │
│ sum = 2 + 15 = 17 > 9          │
│ Too big! Move right ←          │
└─────────────────────────────────┘

Step 2:
┌─────────────────────────────────┐
│ [2,  7,  11,  15]               │
│  ↑       ↑                      │
│ left   right                    │
│ sum = 2 + 11 = 13 > 9          │
│ Still too big! Move right ←    │
└─────────────────────────────────┘

Step 3:
┌─────────────────────────────────┐
│ [2,  7,  11,  15]               │
│  ↑   ↑                          │
│ left right                      │
│ sum = 2 + 7 = 9 = target!      │
│ Return [1, 2] (1-indexed)       │
└─────────────────────────────────┘`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Elegant and efficient:`,
        code: `def twoSum(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            # Return 1-indexed result
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1   # Need larger sum
        else:
            right -= 1  # Need smaller sum

    return []  # Won't reach here (guaranteed solution)`,
      },
      {
        title: "Why 1-indexed?",
        content: `The problem asks for 1-indexed results.

Array indices in code: 0, 1, 2, 3, ...
Problem wants:         1, 2, 3, 4, ...

So we return [left + 1, right + 1]

Be careful! This is a common source of bugs.
Always check what indexing the problem uses.`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Each iteration moves one pointer
- Pointers only move toward each other
- At most n moves total

Space: O(1)
- Only two pointer variables
- No extra data structures

Compare to hash map approach:
- Time: O(n) - same!
- Space: O(n) - hash map stores elements

Two pointers wins on space when array is sorted!`,
      },
    ],
  },

  "3sum": {
    thinking: [
      {
        title: "Breaking Down the Problem",
        content: `Find three numbers that sum to 0.

Brute force: check all triplets → O(n³) 💀

Can we do better? YES!

Key insight: if we FIX one number, we need two
numbers that sum to its NEGATIVE.

nums[i] + nums[j] + nums[k] = 0
→ nums[j] + nums[k] = -nums[i]

This is Two Sum II! (sorted array, find pair with target)`,
      },
      {
        title: "The Sort + Two Pointers Strategy",
        content: `1. Sort the array first
2. For each number nums[i]:
   - Set target = -nums[i]
   - Use two pointers to find pair summing to target
   - This is exactly Two Sum II!

Time: O(n²)
- Outer loop: O(n)
- Inner two-pointer search: O(n)
- Total: O(n × n) = O(n²)

Much better than O(n³)!`,
      },
      {
        title: "Handling Duplicates",
        content: `The tricky part: avoid duplicate triplets!

[-1, -1, 0, 1, 2] - has two -1s

Without care, we'd find [-1, 0, 1] twice.

Solution: skip duplicate values!
- Skip duplicate first numbers: if nums[i] == nums[i-1]
- Skip duplicate second numbers after finding a triplet
- Skip duplicate third numbers after finding a triplet`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Sort the array
2. For i from 0 to n-2:
   a. Skip if nums[i] == nums[i-1] (avoid duplicates)
   b. Set left = i+1, right = n-1
   c. Use two pointers to find pairs summing to -nums[i]
   d. When found, add triplet and skip duplicates
3. Return all triplets`,
      },
      {
        title: "Visual Walkthrough",
        content: `nums = [-1, 0, 1, 2, -1, -4]
sorted = [-4, -1, -1, 0, 1, 2]

i = 0: nums[i] = -4, target = 4
┌─────────────────────────────────┐
│ [-4, -1, -1, 0, 1, 2]           │
│   i   L            R            │
│ -1 + 2 = 1 < 4 → move L         │
│ -1 + 2 = 1 < 4 → move L         │
│  0 + 2 = 2 < 4 → move L         │
│  1 + 2 = 3 < 4 → move L         │
│  L >= R → no triplet with -4    │
└─────────────────────────────────┘

i = 1: nums[i] = -1, target = 1
┌─────────────────────────────────┐
│ [-4, -1, -1, 0, 1, 2]           │
│       i   L        R            │
│ -1 + 2 = 1 = target! ✓          │
│ Found: [-1, -1, 2]              │
│ Move L, R and skip duplicates   │
│ 0 + 1 = 1 = target! ✓           │
│ Found: [-1, 0, 1]               │
└─────────────────────────────────┘

i = 2: nums[i] = -1, SKIP (duplicate of i=1)

Result: [[-1, -1, 2], [-1, 0, 1]]`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Sort + Two Pointers with duplicate handling:`,
        code: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()  # Sort first!
    result = []

    for i in range(len(nums) - 2):
        # Skip duplicate first elements
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        # Two pointers for the remaining pair
        left, right = i + 1, len(nums) - 1
        target = -nums[i]

        while left < right:
            current = nums[left] + nums[right]

            if current == target:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                # Skip duplicates
                while left < right and nums[left] == nums[left-1]:
                    left += 1
                while left < right and nums[right] == nums[right+1]:
                    right -= 1
            elif current < target:
                left += 1
            else:
                right -= 1

    return result`,
      },
      {
        title: "Why Skip Duplicates This Way?",
        content: `For first number (i):
  if i > 0 and nums[i] == nums[i-1]: continue

We check i > 0 to avoid index error.
We compare with PREVIOUS to skip duplicates.

For second/third numbers (after finding triplet):
  while left < right and nums[left] == nums[left-1]:
      left += 1

We move THEN check if same as previous.
This ensures we process each unique value once.`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n²)
- Sorting: O(n log n)
- Outer loop: O(n)
- Inner two-pointer: O(n)
- Total: O(n log n) + O(n²) = O(n²)

Space: O(1) or O(n)
- Depends on sorting algorithm
- Python's sort uses O(n) space
- Two pointers themselves: O(1)

This is optimal! You can't do better than O(n²)
for this problem (need to consider all pairs).`,
      },
    ],
  },

  "container-with-most-water": {
    thinking: [
      {
        title: "Understanding the Problem",
        content: `Imagine vertical lines as walls of containers.
Water level is limited by the SHORTER wall.

height = [1, 8, 6, 2, 5, 4, 8, 3, 7]

        |         |
        |         |     |
        |   |     |     |
        |   |  |  |     |
        |   |  |  |  |  |
        |   |  |  |  |  |  |
        ||  |  |  |  |  |  |
    ────────────────────────
        1  8  6  2  5  4  8  3  7

Area = width × height
Width = distance between lines
Height = min(left_height, right_height)`,
      },
      {
        title: "Why Two Pointers?",
        content: `Brute force: check every pair → O(n²)

Two pointers insight:
- Start with the WIDEST container (both ends)
- Width can only decrease as we move inward
- To potentially find more area, we need MORE height
- The shorter line limits our height
- So... move the pointer at the shorter line!

Why? Moving the taller line can only make things worse:
- Width decreases
- Height stays same or decreases (limited by shorter)`,
      },
      {
        title: "The Greedy Choice",
        content: `At each step, we move the shorter line's pointer.

Why is this correct?

If left line is shorter:
- Current area = width × height[left]
- Any container with this left line has same height limit
- Moving right inward only decreases width
- So we've found the BEST container using this left line
- Safe to move on!

This greedy choice guarantees we find the maximum.`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. left = 0, right = n-1 (widest container)
2. Calculate area, update max if larger
3. Move pointer pointing to shorter line
4. Repeat until pointers meet
5. Return maximum area found`,
      },
      {
        title: "Visual Walkthrough",
        content: `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
          index:  0  1  2  3  4  5  6  7  8

Step 1:
┌────────────────────────────────────┐
│ [1, 8, 6, 2, 5, 4, 8, 3, 7]        │
│  ↑                       ↑         │
│ left=0                right=8      │
│ area = 8 × min(1,7) = 8 × 1 = 8   │
│ height[left] < height[right]       │
│ Move left →                        │
└────────────────────────────────────┘

Step 2:
┌────────────────────────────────────┐
│ [1, 8, 6, 2, 5, 4, 8, 3, 7]        │
│     ↑                    ↑         │
│  left=1             right=8        │
│ area = 7 × min(8,7) = 7 × 7 = 49  │
│ height[left] > height[right]       │
│ Move right ←                       │
└────────────────────────────────────┘

max_area = 49 (this is the answer!)`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Simple and elegant:`,
        code: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_area = 0

    while left < right:
        # Calculate current area
        width = right - left
        h = min(height[left], height[right])
        area = width * h
        max_area = max(max_area, area)

        # Move the shorter line's pointer
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_area`,
      },
      {
        title: "Why Move the Shorter Line?",
        content: `The key insight explained:

Area = width × min(left_height, right_height)

When we move a pointer:
- Width DECREASES by 1 (guaranteed)
- Height MIGHT increase (if we find taller line)

If we move the TALLER line:
- Width decreases
- Height stays same (still limited by shorter)
- Area definitely decreases or stays same!

If we move the SHORTER line:
- Width decreases
- Height might increase
- Area MIGHT increase!

So moving the shorter line is our only hope for improvement.`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Each iteration moves one pointer
- Pointers meet after at most n-1 moves
- Constant work per iteration

Space: O(1)
- Only a few variables
- No extra data structures

This is optimal for this problem!`,
      },
    ],
  },

  "trapping-rain-water": {
    thinking: [
      {
        title: "Understanding Water Trapping",
        content: `Water at each position depends on walls around it.

height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

         |
     |   ||  |
  |  ||_|||_|||
──────────────────

Water at position i = min(maxLeft, maxRight) - height[i]

At position 2 (height 0):
- Max height to left: 1
- Max height to right: 3
- Water level = min(1, 3) = 1
- Water trapped = 1 - 0 = 1`,
      },
      {
        title: "The Key Insight",
        content: `Water level at any position is determined by:
min(maximum height on left, maximum height on right)

Why minimum? Water overflows over the shorter side!

Naive approach: for each position, scan left and right
to find max heights → O(n²)

Better: precompute maxLeft[] and maxRight[] arrays
→ O(n) time, O(n) space

Best: use two pointers → O(n) time, O(1) space!`,
      },
      {
        title: "Two Pointer Insight",
        content: `We don't need to know BOTH max values at each step.
We only need to know the SMALLER one!

If maxLeft < maxRight:
  → Water at left is bounded by maxLeft
  → We can safely calculate water at left
  → Move left pointer

If maxRight <= maxLeft:
  → Water at right is bounded by maxRight
  → We can safely calculate water at right
  → Move right pointer

This lets us process from both ends!`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. left = 0, right = n-1
2. Track maxLeft and maxRight
3. While left < right:
   a. If maxLeft < maxRight:
      - Water at left is bounded by maxLeft
      - Calculate water, move left
   b. Else:
      - Water at right is bounded by maxRight
      - Calculate water, move right
4. Return total water`,
      },
      {
        title: "Visual Walkthrough",
        content: `height = [0, 1, 0, 2, 1, 0, 1, 3]
              idx:  0  1  2  3  4  5  6  7

Initial: maxL=0, maxR=3, water=0

Step 1: maxL(0) < maxR(3)
┌─────────────────────────────────┐
│ Process left pointer            │
│ maxL = max(0, 0) = 0            │
│ water += 0 - 0 = 0              │
│ Move left →                     │
└─────────────────────────────────┘

Step 2: maxL(0) < maxR(3)
┌─────────────────────────────────┐
│ maxL = max(0, 1) = 1            │
│ water += 1 - 1 = 0              │
│ Move left →                     │
└─────────────────────────────────┘

Step 3: maxL(1) < maxR(3)
┌─────────────────────────────────┐
│ maxL = max(1, 0) = 1            │
│ water += 1 - 0 = 1   ← trapped! │
│ Move left →                     │
└─────────────────────────────────┘

... continue until pointers meet ...`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Two pointers from both ends:`,
        code: `def trap(height: list[int]) -> int:
    if not height:
        return 0

    left, right = 0, len(height) - 1
    max_left = height[left]
    max_right = height[right]
    water = 0

    while left < right:
        if max_left < max_right:
            # Process left side
            left += 1
            max_left = max(max_left, height[left])
            water += max_left - height[left]
        else:
            # Process right side
            right -= 1
            max_right = max(max_right, height[right])
            water += max_right - height[right]

    return water`,
      },
      {
        title: "Why This Works",
        content: `The magic: we always process the SMALLER side.

When maxLeft < maxRight:
  - We KNOW water at left is bounded by maxLeft
  - Even if there's a taller wall further right
  - The left side is the limiting factor
  - Safe to calculate and move on!

When maxRight <= maxLeft:
  - Same logic for right side
  - Water is bounded by maxRight
  - Safe to calculate and move on!

We never need to look ahead - the pointer
positions guarantee correctness.`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Each position processed exactly once
- Constant work per position

Space: O(1)
- Just two pointers and two max trackers
- No arrays needed!

Compare to the precomputation approach:
- Same O(n) time
- But O(n) space for maxLeft[] and maxRight[]

Two pointers is more space-efficient!`,
      },
    ],
  },

  // ==========================================
  // SLIDING WINDOW PROBLEMS
  // ==========================================

  "best-time-to-buy-and-sell-stock": {
    thinking: [
      {
        title: "Understanding the Problem",
        content: `We want to buy low and sell high. But we must BUY before we SELL.

prices = [7, 1, 5, 3, 6, 4]
               ↑        ↑
              buy      sell
           (day 2)   (day 5)

Profit = 6 - 1 = 5

We need to find the maximum difference where the
smaller number comes BEFORE the larger number.`,
      },
      {
        title: "The Key Insight",
        content: `For any selling day, the best buying day is the
MINIMUM price seen so far.

As we scan through prices:
- Track the minimum price we've seen
- At each price, calculate: price - min_so_far
- That's the best profit if we sold TODAY

We just need to track the maximum of all these profits!`,
      },
      {
        title: "Why This is Sliding Window",
        content: `Think of it as a window from the min price to current price.

[7, 1, 5, 3, 6, 4]
    ↑        ↑
   min    current

The "window" is from our buy point to our sell point.
We're effectively sliding through, always keeping
the best buy point (minimum) on the left.`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Initialize min_price = infinity, max_profit = 0
2. For each price:
   a. Update min_price if current is lower
   b. Calculate profit = price - min_price
   c. Update max_profit if profit is higher
3. Return max_profit`,
      },
      {
        title: "Visual Walkthrough",
        content: `prices = [7, 1, 5, 3, 6, 4]

Day 1: price = 7
┌─────────────────────────────────┐
│ min_price = min(∞, 7) = 7       │
│ profit = 7 - 7 = 0              │
│ max_profit = 0                  │
└─────────────────────────────────┘

Day 2: price = 1
┌─────────────────────────────────┐
│ min_price = min(7, 1) = 1  ←new │
│ profit = 1 - 1 = 0              │
│ max_profit = 0                  │
└─────────────────────────────────┘

Day 3: price = 5
┌─────────────────────────────────┐
│ min_price = 1 (unchanged)       │
│ profit = 5 - 1 = 4              │
│ max_profit = 4                  │
└─────────────────────────────────┘

Day 5: price = 6
┌─────────────────────────────────┐
│ min_price = 1 (unchanged)       │
│ profit = 6 - 1 = 5              │
│ max_profit = 5   ← answer!      │
└─────────────────────────────────┘`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Simple and elegant one-pass:`,
        code: `def maxProfit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        # Update minimum price seen so far
        min_price = min(min_price, price)

        # Calculate profit if we sold today
        profit = price - min_price

        # Update maximum profit
        max_profit = max(max_profit, profit)

    return max_profit`,
      },
      {
        title: "Why float('inf')?",
        content: `We initialize min_price to infinity so that
the first price automatically becomes the minimum.

min(∞, 7) = 7

Alternative: initialize min_price = prices[0]
But then you need to handle empty array edge case.

Using infinity is cleaner and handles edge cases naturally.`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Single pass through the array
- Constant work per element

Space: O(1)
- Only two variables: min_price, max_profit
- No extra data structures

This is optimal! You must look at every price
at least once to find the answer.`,
      },
    ],
  },

  "longest-substring-without-repeating-characters": {
    thinking: [
      {
        title: "Understanding the Problem",
        content: `Find the longest SUBSTRING (contiguous) with all unique characters.

s = "abcabcbb"

Substrings to consider:
"a"     → length 1, unique ✓
"ab"    → length 2, unique ✓
"abc"   → length 3, unique ✓
"abca"  → has duplicate 'a' ✗

Longest unique substring: "abc" (length 3)`,
      },
      {
        title: "Why Sliding Window?",
        content: `We need a CONTIGUOUS sequence → window!

Expand right to include new characters.
When we hit a duplicate, shrink from left.

Window always contains unique characters.
Track the maximum window size seen.

s = "abcabcbb"
    [abc]     → window of unique chars, length 3
       [bca]  → after shrinking and expanding`,
      },
      {
        title: "Tracking Uniqueness",
        content: `Use a SET to track characters in current window.

- Adding a char: check if in set, then add
- Removing a char: remove from set
- Checking duplicate: O(1) lookup in set

When we find s[right] is already in set:
  → Keep removing s[left] until duplicate is gone
  → Then add s[right]`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Initialize set, left = 0, max_length = 0
2. For right from 0 to n-1:
   a. While s[right] is in set:
      - Remove s[left] from set
      - left += 1
   b. Add s[right] to set
   c. Update max_length
3. Return max_length`,
      },
      {
        title: "Visual Walkthrough",
        content: `s = "abcabcbb"

Step 1-3: Expand window
┌─────────────────────────────────┐
│ s = [a b c] a b c b b           │
│      L   R                      │
│ set = {a, b, c}                 │
│ max_length = 3                  │
└─────────────────────────────────┘

Step 4: Hit duplicate 'a'
┌─────────────────────────────────┐
│ s = a [b c a] b c b b           │
│        L   R                    │
│ Remove 'a' from left            │
│ set = {b, c, a}                 │
│ max_length = 3 (unchanged)      │
└─────────────────────────────────┘

Step 5: Hit duplicate 'b'
┌─────────────────────────────────┐
│ s = a b [c a b] c b b           │
│          L   R                  │
│ Remove 'b' from left            │
│ set = {c, a, b}                 │
│ max_length = 3 (unchanged)      │
└─────────────────────────────────┘

... continue until end ...

Answer: 3`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Sliding window with a set:`,
        code: `def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left = 0
    max_length = 0

    for right in range(len(s)):
        # Shrink window until no duplicate
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1

        # Add current character
        char_set.add(s[right])

        # Update max length
        max_length = max(max_length, right - left + 1)

    return max_length`,
      },
      {
        title: "Optimized with HashMap",
        content: `Instead of shrinking one by one, jump directly:`,
        code: `def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}  # char -> last seen index
    left = 0
    max_length = 0

    for right in range(len(s)):
        # If char seen and within current window
        if s[right] in char_index and char_index[s[right]] >= left:
            # Jump left to after the duplicate
            left = char_index[s[right]] + 1

        char_index[s[right]] = right
        max_length = max(max_length, right - left + 1)

    return max_length`,
      },
      {
        title: "Complexity Analysis",
        content: `Set approach:
- Time: O(n) - each char added/removed at most once
- Space: O(min(n, m)) where m = alphabet size

HashMap approach:
- Time: O(n) - single pass, no inner while loop
- Space: O(min(n, m))

HashMap is slightly faster in practice because
we don't need to shrink one character at a time.`,
      },
    ],
  },

  "longest-repeating-character-replacement": {
    thinking: [
      {
        title: "Understanding the Problem",
        content: `We can replace up to k characters to make a substring
of the same character as long as possible.

s = "AABABBA", k = 1

"AABABBA" → Replace middle A with B → "AABBBBA"
            Now we have "BBBB" of length 4

The goal: find longest substring where we need
to replace at most k characters.`,
      },
      {
        title: "The Key Insight",
        content: `For any window to be valid:
  (window_size) - (most_frequent_char_count) ≤ k

Why? The most frequent character stays.
All other characters need to be replaced.

Example: window "AABA", most_frequent = 'A' (count 3)
  replacements_needed = 4 - 3 = 1

If k ≥ 1, this window is valid!`,
      },
      {
        title: "The Window Strategy",
        content: `Expand right, adding characters to count.
Track the most frequent character count.

If window becomes invalid (replacements > k):
  → Shrink from left

The window always represents a valid substring
(or we're in the process of making it valid).`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Track character counts in window
2. Track max_count (most frequent in window)
3. For each right:
   a. Add s[right] to counts
   b. Update max_count
   c. While (window_size - max_count) > k:
      - Shrink from left
   d. Update max_length
4. Return max_length`,
      },
      {
        title: "Visual Walkthrough",
        content: `s = "AABABBA", k = 1

Start expanding:
┌─────────────────────────────────┐
│ s = [A A B A] B B A             │
│      L     R                    │
│ counts = {A:3, B:1}             │
│ max_count = 3 (A)               │
│ window = 4, replace = 4-3 = 1   │
│ 1 ≤ k=1 → valid! length = 4    │
└─────────────────────────────────┘

Expand to B:
┌─────────────────────────────────┐
│ s = [A A B A B] B A             │
│      L       R                  │
│ counts = {A:3, B:2}             │
│ max_count = 3 (A)               │
│ window = 5, replace = 5-3 = 2   │
│ 2 > k=1 → invalid! shrink       │
└─────────────────────────────────┘

After shrink:
┌─────────────────────────────────┐
│ s = A [A B A B] B A             │
│        L     R                  │
│ counts = {A:2, B:2}             │
│ max_count = 3 (unchanged*)      │
│ window = 4, replace = 4-3 = 1   │
│ 1 ≤ k=1 → valid!                │
└─────────────────────────────────┘

*max_count doesn't need to decrease (optimization)`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Track counts and max frequency:`,
        code: `def characterReplacement(s: str, k: int) -> int:
    count = {}
    left = 0
    max_count = 0  # Most frequent char in window
    max_length = 0

    for right in range(len(s)):
        # Add right char to count
        count[s[right]] = count.get(s[right], 0) + 1
        max_count = max(max_count, count[s[right]])

        # Shrink if too many replacements needed
        while (right - left + 1) - max_count > k:
            count[s[left]] -= 1
            left += 1

        max_length = max(max_length, right - left + 1)

    return max_length`,
      },
      {
        title: "Why Not Update max_count When Shrinking?",
        content: `Interesting optimization! We don't decrease max_count.

Why? We only care about finding a LONGER valid window.
A longer window needs an even HIGHER max_count.

If max_count is stale (too high):
  → Window appears more valid than it is
  → But we won't find a LONGER window with stale value
  → We'll only find longer window with new higher max_count

This saves us from recalculating max on every shrink!`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Right pointer: n iterations
- Left pointer: moves at most n times total
- Each character operation: O(1)

Space: O(1)
- Count dict has at most 26 entries (uppercase letters)
- Fixed space regardless of input size

Beautiful O(n) solution for what seems complex!`,
      },
    ],
  },

  "permutation-in-string": {
    thinking: [
      {
        title: "What is a Permutation?",
        content: `A permutation rearranges characters but keeps the same counts.

"ab" permutations: "ab", "ba"

So s2 contains a permutation of s1 if:
  → Some substring of s2 has same char counts as s1

s1 = "ab", s2 = "eidbaooo"
                   ↑↑
                  "ba" is a permutation of "ab" ✓`,
      },
      {
        title: "Fixed Size Window",
        content: `Key insight: the window size is FIXED at len(s1)!

We're looking for a substring of length len(s1)
that has the same character counts.

Slide a window of size len(s1) across s2.
At each position, check if counts match.`,
      },
      {
        title: "Efficient Count Comparison",
        content: `Build count dict for s1 once.
Build count dict for first window of s2.

Then slide:
  → Add new character (right)
  → Remove old character (left)
  → Compare with s1 counts

This way we don't rebuild counts from scratch each time!`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Count characters in s1
2. Count characters in first window of s2 (size len(s1))
3. If counts match, return True
4. Slide window across s2:
   a. Add new right character
   b. Remove old left character
   c. If counts match, return True
5. Return False`,
      },
      {
        title: "Visual Walkthrough",
        content: `s1 = "ab", s2 = "eidbaooo"
s1_count = {a:1, b:1}

Initial window "ei":
┌─────────────────────────────────┐
│ s2 = [e i] d b a o o o          │
│ window = {e:1, i:1}             │
│ window == s1_count? NO          │
└─────────────────────────────────┘

Slide to "id":
┌─────────────────────────────────┐
│ s2 = e [i d] b a o o o          │
│ Remove 'e', add 'd'             │
│ window = {i:1, d:1}             │
│ window == s1_count? NO          │
└─────────────────────────────────┘

Slide to "ba":
┌─────────────────────────────────┐
│ s2 = e i d [b a] o o o          │
│ window = {b:1, a:1}             │
│ window == s1_count? YES! ✓      │
└─────────────────────────────────┘

Return True`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Fixed-size sliding window with count comparison:`,
        code: `def checkInclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2):
        return False

    # Count characters in s1
    s1_count = {}
    for c in s1:
        s1_count[c] = s1_count.get(c, 0) + 1

    # Initialize window with first len(s1) chars
    window = {}
    for i in range(len(s1)):
        c = s2[i]
        window[c] = window.get(c, 0) + 1

    if window == s1_count:
        return True

    # Slide window
    for i in range(len(s1), len(s2)):
        # Add new char (right side)
        window[s2[i]] = window.get(s2[i], 0) + 1

        # Remove old char (left side)
        old = s2[i - len(s1)]
        window[old] -= 1
        if window[old] == 0:
            del window[old]  # Remove zero counts

        if window == s1_count:
            return True

    return False`,
      },
      {
        title: "Why Delete Zero Counts?",
        content: `When comparing dicts, {a:1, b:0} != {a:1}

So we need to delete keys with zero count.

Alternative: use Counter from collections
Counter({a:1, b:0}) == Counter({a:1}) → True
Counter handles this automatically!`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n) where n = len(s2)
- Build s1_count: O(m) where m = len(s1)
- Slide window: O(n - m) iterations
- Dict comparison: O(26) = O(1) for lowercase letters

Space: O(1)
- Both dicts have at most 26 keys
- Fixed space regardless of string lengths

This is optimal for the problem!`,
      },
    ],
  },

  "minimum-window-substring": {
    thinking: [
      {
        title: "Understanding the Problem",
        content: `Find the SHORTEST substring of s that contains ALL
characters of t (with correct frequencies).

s = "ADOBECODEBANC", t = "ABC"

"ADOBEC" contains A, B, C ✓ (length 6)
"BECODEBA" contains A, B, C ✓ but not minimal
"BANC" contains A, B, C ✓ (length 4) ← answer!

We need all chars of t, including duplicates.`,
      },
      {
        title: "The Two-Pointer Dance",
        content: `This is the classic "expand then shrink" pattern.

1. EXPAND right until we have all chars of t
2. SHRINK left as much as possible while still valid
3. Record the window if it's the smallest so far
4. Shrink one more (making it invalid)
5. Repeat from step 1

We're looking for the MINIMUM valid window.`,
      },
      {
        title: "Tracking Requirements",
        content: `Use two concepts:
- "need": count of each char we need from t
- "formed": number of unique chars that meet requirement

When formed == len(need), window is valid!

Example: t = "ABC"
- need = {A:1, B:1, C:1}
- required = 3 (unique chars)
- When A≥1, B≥1, C≥1 in window → formed = 3 → valid!`,
      },
    ],
    approach: [
      {
        title: "The Strategy",
        content: `1. Build "need" dict from t
2. Initialize left = 0, formed = 0, min_window
3. For each right:
   a. Add s[right] to window counts
   b. If s[right] meets requirement, formed += 1
   c. While formed == required (valid window):
      - Update min_window if smaller
      - Remove s[left], update formed if needed
      - left += 1
4. Return min_window or ""`,
      },
      {
        title: "Visual Walkthrough",
        content: `s = "ADOBECODEBANC", t = "ABC"
need = {A:1, B:1, C:1}, required = 3

Expand until valid:
┌─────────────────────────────────────┐
│ [A D O B E C] O D E B A N C         │
│  L         R                        │
│ window = {A:1, D:1, O:1, B:1, E:1, C:1} │
│ formed = 3 (A✓ B✓ C✓)               │
│ Valid! Length 6, record it          │
└─────────────────────────────────────┘

Shrink from left:
┌─────────────────────────────────────┐
│ A [D O B E C] O D E B A N C         │
│    L       R                        │
│ Removed A, formed = 2 (missing A)   │
│ Invalid, stop shrinking             │
└─────────────────────────────────────┘

Expand again... eventually find:
┌─────────────────────────────────────┐
│ A D O B E C O D E [B A N C]         │
│                    L     R          │
│ formed = 3, length 4                │
│ Smallest so far! ← answer           │
└─────────────────────────────────────┘`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Expand-shrink sliding window:`,
        code: `def minWindow(s: str, t: str) -> str:
    if not t or not s:
        return ""

    # Count chars needed from t
    need = {}
    for c in t:
        need[c] = need.get(c, 0) + 1

    required = len(need)  # Unique chars to satisfy
    formed = 0            # Unique chars currently satisfied
    window = {}

    left = 0
    min_len = float('inf')
    result = (0, 0)

    for right in range(len(s)):
        c = s[right]
        window[c] = window.get(c, 0) + 1

        # Check if this char now satisfies its requirement
        if c in need and window[c] == need[c]:
            formed += 1

        # Shrink window while valid
        while formed == required:
            # Update result if this is smaller
            if right - left + 1 < min_len:
                min_len = right - left + 1
                result = (left, right + 1)

            # Remove leftmost char
            left_char = s[left]
            window[left_char] -= 1
            if left_char in need and window[left_char] < need[left_char]:
                formed -= 1
            left += 1

    return "" if min_len == float('inf') else s[result[0]:result[1]]`,
      },
      {
        title: "The formed Counter Trick",
        content: `Why use "formed" instead of checking all counts?

Checking all: O(26) or O(len(t)) each time
Using formed: O(1) check (formed == required?)

We only update formed when:
- A char REACHES its requirement (formed += 1)
- A char DROPS BELOW its requirement (formed -= 1)

This is more efficient than comparing dicts!`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(m + n) where m = len(s), n = len(t)
- Build need dict: O(n)
- Sliding window: O(m)
  - Each char enters window once
  - Each char leaves window at most once
  - All operations O(1)

Space: O(m + n)
- need dict: O(n) unique chars
- window dict: O(m) unique chars
- For just letters: O(52) = O(1)

This is optimal! You must check every char at least once.`,
      },
    ],
  },

  // ==================== STACK ====================
  "valid-parentheses": {
    thinking: [
      {
        title: "Why is a Stack Perfect Here?",
        content: `Think about reading code with nested brackets:

( [ { } ] )

When you see an opening bracket, you expect its match LATER.
When you see a closing bracket, it should match the MOST RECENT opener.

This is exactly LIFO (Last In, First Out) - a stack!

The key insight: Every closing bracket must match the
most recently seen unmatched opening bracket.`,
      },
      {
        title: "What Could Go Wrong?",
        content: `Three types of invalid strings:

1. MISMATCH: "( ]" - closer doesn't match opener
2. TOO MANY CLOSERS: ") (" - closer with nothing to match
3. TOO MANY OPENERS: "( (" - openers left unmatched

We need to handle all three cases!`,
      },
      {
        title: "The Matching Strategy",
        content: `Use a hash map for O(1) bracket matching:

    ')' → '('
    ']' → '['
    '}' → '{'

When we see a closer, we know exactly what opener
should be on top of the stack.`,
      },
    ],
    approach: [
      {
        title: "Stack-Based Validation",
        content: `The algorithm:

1. Create a map: closer → opener
2. For each character:
   - If opener: push to stack
   - If closer: check stack top matches
3. Return True if stack is empty at end

Visual example with "([])":

    Char    Action              Stack
    ─────────────────────────────────
    (       push '('            ['(']
    [       push '['            ['(', '[']
    ]       pop, check='['      ['(']
    )       pop, check='('      []

    Stack empty → VALID ✓`,
      },
      {
        title: "Edge Cases to Consider",
        content: `Empty string "" → Valid (nothing to match)
Single opener "(" → Invalid (unmatched)
Single closer ")" → Invalid (nothing to match with)
Nested "((()))" → Valid
Interleaved "([)]" → Invalid! Not properly nested

The interleaved case is why we NEED a stack:
"([)]" fails because ] should match [ but finds (`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Here's the clean Python solution:`,
        code: `def isValid(s: str) -> bool:
    stack = []
    match = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in match:  # It's a closer
            # Stack must have matching opener
            if not stack or stack[-1] != match[char]:
                return False
            stack.pop()
        else:  # It's an opener
            stack.append(char)

    return len(stack) == 0  # All openers matched?`,
      },
      {
        title: "Trace Through: \"([])\"",
        content: `Let's trace step by step:

    s = "([])
    stack = []
    match = {')': '(', ']': '[', '}': '{'}

    char = '(':
      Not in match (opener) → push
      stack = ['(']

    char = '[':
      Not in match (opener) → push
      stack = ['(', '[']

    char = ']':
      In match (closer)
      stack[-1] = '[' == match[']'] = '[' ✓
      stack.pop() → stack = ['(']

    char = ')':
      In match (closer)
      stack[-1] = '(' == match[')'] = '(' ✓
      stack.pop() → stack = []

    len(stack) == 0 → return True ✓`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Single pass through string
- Each char: O(1) push/pop operations
- Hash map lookup: O(1)

Space: O(n)
- Worst case: all openers "(((((("
- Stack holds n/2 chars in valid string
- Hash map: O(1) - only 3 pairs

This is optimal! Must see every character at least once.`,
      },
    ],
  },

  "min-stack": {
    thinking: [
      {
        title: "The Challenge",
        content: `Regular stack operations are easy:
- push: O(1)
- pop: O(1)
- top: O(1)

But getMin() in O(1)? That's the trick!

If we just track one min value, what happens
when we pop that min? We lose track of the
NEXT minimum. We need history!`,
      },
      {
        title: "Why We Need Two Stacks",
        content: `Example sequence:

    push(3): min=3
    push(1): min=1
    push(2): min=1
    pop():   min=? (removed 2, still 1)
    pop():   min=? (removed 1, now what?)

When we pop 1, we need to know the previous min was 3!
We need to remember the minimum AT EACH STATE.`,
      },
      {
        title: "The Parallel Stack Idea",
        content: `Keep two stacks in sync:
- Main stack: all values
- Min stack: minimum at each level

    Main: [3, 1, 2]     Min: [3, 1, 1]
          ↑                   ↑
          top                 current min

When we pop from main, also pop from min.
Min stack always shows current minimum!`,
      },
    ],
    approach: [
      {
        title: "Two-Stack Solution",
        content: `Data structure:
- self.stack: regular stack for values
- self.min_stack: parallel stack tracking minimums

Operations:
- push(x): push to both stacks
  - min_stack gets min(x, current_min)
- pop(): pop from both stacks
- top(): return stack[-1]
- getMin(): return min_stack[-1]

All O(1) because we just access stack tops!`,
      },
      {
        title: "Visualizing the Two Stacks",
        content: `push(5), push(2), push(7), push(1), pop(), pop()

    Operation   Main Stack    Min Stack     getMin()
    ─────────────────────────────────────────────────
    push(5)     [5]           [5]           5
    push(2)     [5,2]         [5,2]         2
    push(7)     [5,2,7]       [5,2,2]       2
    push(1)     [5,2,7,1]     [5,2,2,1]     1
    pop()       [5,2,7]       [5,2,2]       2
    pop()       [5,2]         [5,2]         2

Notice: min_stack keeps the running minimum!`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Here's the clean implementation:`,
        code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        # Min is either this val or previous min
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
      },
      {
        title: "Why This Works",
        content: `The key insight:

min_stack[i] = minimum of stack[0:i+1]

When we pop, both stacks shrink together.
The new top of min_stack is ALREADY the correct
minimum for the remaining elements!

    Before pop:     After pop:
    stack=[5,2,7]   stack=[5,2]
    min_s=[5,2,2]   min_s=[5,2]
              ↑            ↑
           min=2        min=2 (still correct!)

We pre-computed all possible minimums!`,
      },
      {
        title: "Complexity Analysis",
        content: `Time Complexity: ALL O(1)
- push: O(1) - append to both stacks
- pop: O(1) - pop from both stacks
- top: O(1) - access stack[-1]
- getMin: O(1) - access min_stack[-1]

Space: O(n)
- Two stacks, each up to n elements
- Could optimize to O(1) extra space with
  a clever encoding, but this is cleaner

The two-stack approach is the standard solution!`,
      },
    ],
  },

  "evaluate-reverse-polish-notation": {
    thinking: [
      {
        title: "What is Reverse Polish Notation?",
        content: `Normal (infix): 3 + 4
RPN (postfix):  3 4 +

The operator comes AFTER its operands!

Why RPN?
- No parentheses needed
- No precedence rules
- Easy to evaluate with a stack
- Used by HP calculators, PostScript

Example: (3 + 4) * 2
Infix:   (3 + 4) * 2   (needs parens)
RPN:     3 4 + 2 *     (no parens!)`,
      },
      {
        title: "Why Stack is Perfect",
        content: `In RPN, when you see an operator, the operands
are the two most recent numbers you've seen.

    3 4 + 2 *

    Read 3: remember it
    Read 4: remember it
    Read +: use 4 and 3 (most recent), compute 7
    Read 2: remember it
    Read *: use 2 and 7 (most recent), compute 14

"Most recent" = top of stack = LIFO!`,
      },
      {
        title: "Order Matters for Some Operations",
        content: `Addition: 3 + 4 = 4 + 3 (doesn't matter)
Subtraction: 3 - 4 ≠ 4 - 3 (ORDER MATTERS!)
Division: 3 / 4 ≠ 4 / 3 (ORDER MATTERS!)

In RPN "3 4 -" means 3 - 4, not 4 - 3

When we pop:
  b = stack.pop()  # second operand (4)
  a = stack.pop()  # first operand (3)
  result = a - b   # 3 - 4, correct order!`,
      },
    ],
    approach: [
      {
        title: "Stack-Based Evaluation",
        content: `Simple algorithm:

1. For each token:
   - If number: push to stack
   - If operator: pop two, compute, push result
2. Return final value on stack

    ["3", "4", "+", "2", "*"]

    Token   Action              Stack
    ─────────────────────────────────
    "3"     push 3              [3]
    "4"     push 4              [3, 4]
    "+"     pop 4,3 → 3+4=7     [7]
    "2"     push 2              [7, 2]
    "*"     pop 2,7 → 7*2=14    [14]

    Result: 14`,
      },
      {
        title: "Handling Division",
        content: `Python gotcha with negative division!

In this problem: truncate toward zero
-  7 / 3 = 2  (not 2.333...)
- -7 / 3 = -2 (not -3 like Python's //)

Python's // rounds toward negative infinity:
  -7 // 3 = -3  ← Wrong for this problem!

Fix: Use int(a / b) to truncate toward zero
  int(-7 / 3) = int(-2.33) = -2  ✓`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Here's the implementation:`,
        code: `def evalRPN(tokens: list[str]) -> int:
    stack = []

    for token in tokens:
        if token in "+-*/":
            b = stack.pop()  # Second operand
            a = stack.pop()  # First operand

            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            else:  # Division
                # Truncate toward zero
                stack.append(int(a / b))
        else:
            stack.append(int(token))

    return stack[0]`,
      },
      {
        title: "Trace: [\"4\",\"13\",\"5\",\"/\",\"+\"]",
        content: `This represents: 4 + (13 / 5) = 4 + 2 = 6

    Token   Stack         Action
    ─────────────────────────────────────
    "4"     [4]           push 4
    "13"    [4, 13]       push 13
    "5"     [4, 13, 5]    push 5
    "/"     [4, 2]        13/5=2, push 2
    "+"     [6]           4+2=6, push 6

    Return stack[0] = 6 ✓

Note: 13/5 = 2.6 → truncate to 2`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Process each token once
- All operations O(1)

Space: O(n)
- Worst case: all numbers before operators
- Example: "1 2 3 4 + + +" → stack holds 4 values
- At most (n+1)/2 numbers on stack

Why RPN is used in real systems:
- No need to parse parentheses
- No operator precedence to handle
- Single left-to-right pass
- Hardware calculators use this!`,
      },
    ],
  },

  "daily-temperatures": {
    thinking: [
      {
        title: "Understanding the Problem",
        content: `Given temperatures, find days until warmer day.

    temps = [73, 74, 75, 71, 69, 72, 76, 73]
    answer = [1,  1,  4,  2,  1,  1,  0,  0]

    73 → next warmer is 74 (1 day)
    75 → next warmer is 76 (4 days away)
    76 → no warmer day (0)
    73 → no warmer day (0)

Brute force: For each day, scan right → O(n²)
Can we do better?`,
      },
      {
        title: "The Key Insight",
        content: `When we find a warm day, it might be the answer
for MULTIPLE previous cooler days!

    Day:  0   1   2   3   4   5   6
    Temp: 73  74  75  71  69  72  76
          ↑   ↑   ↑   ↑   ↑   ↑   ↑
          │   │   │   │   │   │   └── 76 is warmer than 72,71,69,75!
          │   │   │   │   │   └── 72 is warmer than 69,71

When we see 72, we can resolve 69 AND 71!
When we see 76, we resolve everything waiting!

Process right-to-left? Or... use a stack!`,
      },
      {
        title: "Monotonic Stack Pattern",
        content: `Keep a stack of indices we haven't found answers for.
The stack maintains DECREASING temperatures!

Why decreasing? Because:
- If temp[i] < temp[top], i is still waiting
- If temp[i] > temp[top], we found the answer for top!

When we find a warmer day, pop all cooler days
from stack and record their answers.

This is called a MONOTONIC DECREASING STACK.`,
      },
    ],
    approach: [
      {
        title: "Monotonic Stack Algorithm",
        content: `Process temperatures left to right:

1. While stack not empty AND current temp > stack top temp:
   - Pop index from stack
   - That day's answer = current_index - popped_index
2. Push current index to stack
3. Remaining stack items have answer 0

    temps = [73, 74, 75, 71, 69, 72, 76, 73]

    i=0: stack=[], push 0        → stack=[0]
    i=1: 74>73, pop 0, ans[0]=1  → stack=[1]
    i=2: 75>74, pop 1, ans[1]=1  → stack=[2]
    i=3: 71<75, push 3           → stack=[2,3]
    i=4: 69<71, push 4           → stack=[2,3,4]
    i=5: 72>69, pop 4, ans[4]=1
         72>71, pop 3, ans[3]=2  → stack=[2,5]
    i=6: 76>72, pop 5, ans[5]=1
         76>75, pop 2, ans[2]=4  → stack=[6]
    i=7: 73<76, push 7           → stack=[6,7]

    ans[6]=0, ans[7]=0 (nothing popped them)`,
      },
      {
        title: "Why Store Indices, Not Temps?",
        content: `We need to calculate DISTANCE: current_i - prev_i

If we stored temperatures, we'd lose position info!

Stack stores: indices where we're still looking
Stack property: temps[stack[i]] is decreasing

    Stack: [2, 3, 4]  (indices)
    Temps: 75, 71, 69 (corresponding temps)
           ↓   ↓   ↓
           decreasing!

This lets us:
1. Compare temps: temps[stack[-1]] vs temps[i]
2. Calculate distance: i - stack[-1]`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Here's the monotonic stack solution:`,
        code: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    answer = [0] * n
    stack = []  # Store indices

    for i in range(n):
        # Pop all cooler days - we found their answer!
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev_i = stack.pop()
            answer[prev_i] = i - prev_i

        # Current day is still waiting for warmer
        stack.append(i)

    # Days left in stack never found warmer (answer stays 0)
    return answer`,
      },
      {
        title: "Visual Trace",
        content: `temps = [73, 74, 75, 71, 69, 72, 76, 73]

    i   temp   Stack (indices→temps)      answer[]
    ────────────────────────────────────────────────
    0   73     [0→73]                      [0,0,0,0,0,0,0,0]
    1   74     [1→74]                      [1,0,0,0,0,0,0,0]
               (popped 0, ans[0]=1-0=1)
    2   75     [2→75]                      [1,1,0,0,0,0,0,0]
               (popped 1, ans[1]=2-1=1)
    3   71     [2→75, 3→71]                [1,1,0,0,0,0,0,0]
    4   69     [2→75, 3→71, 4→69]          [1,1,0,0,0,0,0,0]
    5   72     [2→75, 5→72]                [1,1,0,2,1,0,0,0]
               (popped 4, ans[4]=1; popped 3, ans[3]=2)
    6   76     [6→76]                      [1,1,4,2,1,1,0,0]
               (popped 5, ans[5]=1; popped 2, ans[2]=4)
    7   73     [6→76, 7→73]                [1,1,4,2,1,1,0,0]

    Final: [1,1,4,2,1,1,0,0] ✓`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Each index pushed once
- Each index popped at most once
- Total operations: 2n → O(n)

Space: O(n)
- Stack holds at most n indices
- Worst case: strictly decreasing temps
  [100, 99, 98, 97, ...] → stack holds all

The monotonic stack pattern appears in many problems:
- Next Greater Element
- Stock Span
- Largest Rectangle in Histogram
- Trapping Rain Water (variant)

Master this pattern!`,
      },
    ],
  },

  "largest-rectangle-in-histogram": {
    thinking: [
      {
        title: "Understanding the Problem",
        content: `Find the largest rectangle in a histogram.

    heights = [2, 1, 5, 6, 2, 3]

          █
        █ █
        █ █   █
    █   █ █ █ █
    █ █ █ █ █ █
    ─────────────
    2 1 5 6 2 3

The largest rectangle has area 10 (width 2, height 5).

For each bar, we could extend left and right
until we hit a shorter bar. That defines
the widest rectangle with that bar's height.`,
      },
      {
        title: "The Key Question",
        content: `For each bar at index i with height h:
- How far LEFT can we extend? Until height < h
- How far RIGHT can we extend? Until height < h

    heights = [2, 1, 5, 6, 2, 3]
                    ↑
                    For height 5 at index 2:
                    Left bound: index 2 (1 is shorter)
                    Right bound: index 3 (2 is shorter)
                    Width = 3 - 2 = 1... wait, that's wrong!

Actually: Width should be 2 (indices 2 and 3)
We need the first SMALLER bar, not just different.`,
      },
      {
        title: "Monotonic Increasing Stack",
        content: `Similar to Daily Temperatures, but:
- We want SMALLER elements (not greater)
- Stack is INCREASING (not decreasing)

When we find a shorter bar, all taller bars
in the stack can no longer extend right!

We calculate their area and pop them.

Stack stores indices in increasing height order.
When height drops, we process completed rectangles.`,
      },
    ],
    approach: [
      {
        title: "The Algorithm",
        content: `Use increasing monotonic stack:

1. For each bar i:
   - While stack top is taller than current:
     - Pop top, calculate its rectangle area
     - Width = i - left_boundary - 1
     - left_boundary = new stack top (or -1)
   - Push current index
2. Process remaining stack (extend to end)

When we pop height h at index j:
- Right boundary: current index i (first shorter)
- Left boundary: stack top after pop (first shorter on left)
- Width: i - left_boundary - 1`,
      },
      {
        title: "Visual Example",
        content: `heights = [2, 1, 5, 6, 2, 3]

    i=0: h=2, stack=[], push 0      → [0]
    i=1: h=1 < 2
         pop 0, height=2, width=1-(-1)-1=1, area=2
         push 1                      → [1]
    i=2: h=5 > 1, push 2            → [1,2]
    i=3: h=6 > 5, push 3            → [1,2,3]
    i=4: h=2 < 6
         pop 3, height=6, width=4-2-1=1, area=6
         pop 2, height=5, width=4-1-1=2, area=10 ★
         push 4                      → [1,4]
    i=5: h=3 > 2, push 5            → [1,4,5]

    Process remaining (right bound = 6):
    pop 5, height=3, width=6-4-1=1, area=3
    pop 4, height=2, width=6-1-1=4, area=8
    pop 1, height=1, width=6-(-1)-1=6, area=6

    Maximum: 10`,
      },
    ],
    walkthrough: [
      {
        title: "The Solution",
        content: `Here's the monotonic stack solution:`,
        code: `def largestRectangleArea(heights: list[int]) -> int:
    stack = []  # Store indices
    max_area = 0

    for i, h in enumerate(heights):
        start = i  # Where this height can start from

        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            area = height * (i - idx)
            max_area = max(max_area, area)
            start = idx  # This height can extend back

        stack.append((start, h))

    # Process remaining - they extend to the end
    for idx, height in stack:
        area = height * (len(heights) - idx)
        max_area = max(max_area, area)

    return max_area`,
      },
      {
        title: "Alternative: Sentinel Approach",
        content: `Add 0 at both ends to simplify edge cases:`,
        code: `def largestRectangleArea(heights: list[int]) -> int:
    heights = [0] + heights + [0]  # Sentinels
    stack = [0]  # Start with left sentinel
    max_area = 0

    for i in range(1, len(heights)):
        while heights[i] < heights[stack[-1]]:
            h = heights[stack.pop()]
            w = i - stack[-1] - 1
            max_area = max(max_area, h * w)
        stack.append(i)

    return max_area`,
      },
      {
        title: "Complexity Analysis",
        content: `Time: O(n)
- Each bar pushed once
- Each bar popped once
- Total: 2n operations → O(n)

Space: O(n)
- Stack holds at most n indices
- Worst case: increasing heights [1,2,3,4,5]

Why this works:
- When we pop bar j at position i:
  - Right boundary: i (first shorter bar)
  - Left boundary: stack top (first shorter on left)
  - Width calculation captures full extent!

This is a classic hard problem. The monotonic
stack pattern makes it elegant and efficient!`,
      },
    ],
  },
};
