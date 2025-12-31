const { PrismaClient } = require('@prisma/client');

const prismaClient = new PrismaClient();

async function run() {
  console.log("Starting seed...");

  // Create Topic: Fundamentals
  const fundamentalsTopic = await prismaClient.topic.upsert({
    where: { slug: "fundamentals" },
    update: {},
    create: {
      slug: "fundamentals",
      title: "Fundamentals",
      description: "Master the core building blocks of data structures and algorithms. Start here if you're new to coding interviews.",
      order: 1,
      iconName: "BookOpen",
      theoryContent: `# Fundamentals

Welcome to the Fundamentals module! This is where your journey to mastering coding interviews begins.

## What You'll Learn

- **Arrays & Hashing**: The foundation of all data structures
- **Basic Data Manipulation**: How to efficiently store and retrieve data
- **Time & Space Complexity**: Understanding Big O notation`,
      estimatedHours: 10,
      difficulty: "beginner",
      isPublished: true,
      isPremium: false,
    },
  });
  console.log("Created topic:", fundamentalsTopic.title);

  // Create Trees & Graphs Topic
  const treesGraphsTopic = await prismaClient.topic.upsert({
    where: { slug: "trees-graphs" },
    update: {},
    create: {
      slug: "trees-graphs",
      title: "Trees & Graphs",
      description: "Master hierarchical and networked data structures.",
      order: 2,
      iconName: "GitBranch",
      theoryContent: "# Trees & Graphs\n\nLearn tree traversals, graph algorithms, and more.",
      estimatedHours: 15,
      difficulty: "intermediate",
      isPublished: true,
      isPremium: false,
    },
  });
  console.log("Created topic:", treesGraphsTopic.title);

  // Create Dynamic Programming Topic
  const dpTopic = await prismaClient.topic.upsert({
    where: { slug: "dynamic-programming" },
    update: {},
    create: {
      slug: "dynamic-programming",
      title: "Dynamic Programming",
      description: "Solve optimization problems by breaking them into subproblems.",
      order: 3,
      iconName: "Layers",
      theoryContent: "# Dynamic Programming\n\nLearn memoization, tabulation, and state transitions.",
      estimatedHours: 20,
      difficulty: "advanced",
      isPublished: true,
      isPremium: false,
    },
  });
  console.log("Created topic:", dpTopic.title);

  // Create Advanced Topic
  const advancedTopic = await prismaClient.topic.upsert({
    where: { slug: "advanced-patterns" },
    update: {},
    create: {
      slug: "advanced-patterns",
      title: "Advanced Patterns",
      description: "Specialized techniques for specific problem types.",
      order: 4,
      iconName: "Zap",
      theoryContent: "# Advanced Patterns\n\nIntervals, Greedy, Tries, Bit Manipulation, and more.",
      estimatedHours: 15,
      difficulty: "advanced",
      isPublished: true,
      isPremium: false,
    },
  });
  console.log("Created topic:", advancedTopic.title);

  // ======== PATTERNS ========

  // Arrays & Hashing Pattern
  const arraysHashingPattern = await prismaClient.pattern.upsert({
    where: { slug: "arrays-hashing" },
    update: {},
    create: {
      slug: "arrays-hashing",
      title: "Arrays & Hashing",
      description: "Foundation of all DSA. Hash maps for O(1) lookups.",
      order: 1,
      topicId: fundamentalsTopic.id,
      explanation: "# Arrays & Hashing Pattern\n\nUse arrays and hash maps when you need O(1) lookups.",
      template: "def solve(nums):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target in seen:\n            return result\n        seen[num] = i",
      isPremium: false,
    },
  });
  console.log("Created pattern:", arraysHashingPattern.title);

  // Two Pointers Pattern
  const twoPointersPattern = await prismaClient.pattern.upsert({
    where: { slug: "two-pointers" },
    update: {},
    create: {
      slug: "two-pointers",
      title: "Two Pointers",
      description: "Efficient traversal with two moving pointers.",
      order: 2,
      topicId: fundamentalsTopic.id,
      explanation: "# Two Pointers\n\nUse two pointers for sorted arrays, palindromes, and more.",
      template: "def solve(arr):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        # process\n        left += 1\n        right -= 1",
      isPremium: false,
    },
  });
  console.log("Created pattern:", twoPointersPattern.title);

  // Sliding Window Pattern
  const slidingWindowPattern = await prismaClient.pattern.upsert({
    where: { slug: "sliding-window" },
    update: {},
    create: {
      slug: "sliding-window",
      title: "Sliding Window",
      description: "Fixed or variable size window for substring/subarray problems.",
      order: 3,
      topicId: fundamentalsTopic.id,
      explanation: "# Sliding Window\n\nUse for contiguous subarray/substring problems.",
      template: "def solve(s):\n    left = 0\n    for right in range(len(s)):\n        # expand window\n        while invalid:\n            # shrink window\n            left += 1",
      isPremium: false,
    },
  });
  console.log("Created pattern:", slidingWindowPattern.title);

  // Stack Pattern
  const stackPattern = await prismaClient.pattern.upsert({
    where: { slug: "stack" },
    update: {},
    create: {
      slug: "stack",
      title: "Stack",
      description: "LIFO data structure for parsing, backtracking, and monotonic problems.",
      order: 4,
      topicId: fundamentalsTopic.id,
      explanation: "# Stack Pattern\n\nUse for matching brackets, monotonic problems, and backtracking.",
      template: "def solve(arr):\n    stack = []\n    for item in arr:\n        while stack and condition:\n            stack.pop()\n        stack.append(item)",
      isPremium: false,
    },
  });
  console.log("Created pattern:", stackPattern.title);

  // Binary Search Pattern
  const binarySearchPattern = await prismaClient.pattern.upsert({
    where: { slug: "binary-search" },
    update: {},
    create: {
      slug: "binary-search",
      title: "Binary Search",
      description: "O(log n) search in sorted arrays.",
      order: 5,
      topicId: fundamentalsTopic.id,
      explanation: "# Binary Search\n\nDivide and conquer for sorted data.",
      template: "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1",
      isPremium: false,
    },
  });
  console.log("Created pattern:", binarySearchPattern.title);

  // Linked List Pattern
  const linkedListPattern = await prismaClient.pattern.upsert({
    where: { slug: "linked-list" },
    update: {},
    create: {
      slug: "linked-list",
      title: "Linked List",
      description: "Pointer manipulation for sequential node-based data structures.",
      order: 6,
      topicId: fundamentalsTopic.id,
      explanation: "# Linked List\n\nUse fast/slow pointers, dummy heads, and reversal techniques.",
      template: "def reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev",
      isPremium: false,
    },
  });
  console.log("Created pattern:", linkedListPattern.title);

  // Trees Pattern
  const treesPattern = await prismaClient.pattern.upsert({
    where: { slug: "trees" },
    update: {},
    create: {
      slug: "trees",
      title: "Trees",
      description: "Binary trees, BSTs, and tree traversals.",
      order: 1,
      topicId: treesGraphsTopic.id,
      explanation: "# Trees\n\nDFS, BFS, inorder, preorder, postorder traversals.",
      template: "def dfs(root):\n    if not root:\n        return\n    # preorder: process root\n    dfs(root.left)\n    # inorder: process root\n    dfs(root.right)\n    # postorder: process root",
      isPremium: false,
    },
  });
  console.log("Created pattern:", treesPattern.title);

  // Heap Pattern
  const heapPattern = await prismaClient.pattern.upsert({
    where: { slug: "heap" },
    update: {},
    create: {
      slug: "heap",
      title: "Heap / Priority Queue",
      description: "Efficient min/max operations for streaming data.",
      order: 2,
      topicId: treesGraphsTopic.id,
      explanation: "# Heap\n\nUse for top-k, median, and scheduling problems.",
      template: "import heapq\n\ndef solve(nums, k):\n    heap = []\n    for num in nums:\n        heapq.heappush(heap, num)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return heap[0]",
      isPremium: false,
    },
  });
  console.log("Created pattern:", heapPattern.title);

  // Backtracking Pattern
  const backtrackingPattern = await prismaClient.pattern.upsert({
    where: { slug: "backtracking" },
    update: {},
    create: {
      slug: "backtracking",
      title: "Backtracking",
      description: "Explore all possibilities with pruning.",
      order: 3,
      topicId: treesGraphsTopic.id,
      explanation: "# Backtracking\n\nUse for permutations, combinations, and constraint satisfaction.",
      template: "def backtrack(path, choices):\n    if is_solution(path):\n        result.append(path[:])\n        return\n    for choice in choices:\n        path.append(choice)\n        backtrack(path, remaining_choices)\n        path.pop()",
      isPremium: false,
    },
  });
  console.log("Created pattern:", backtrackingPattern.title);

  // Graphs Pattern
  const graphsPattern = await prismaClient.pattern.upsert({
    where: { slug: "graphs" },
    update: {},
    create: {
      slug: "graphs",
      title: "Graphs",
      description: "BFS, DFS, and graph traversal algorithms.",
      order: 4,
      topicId: treesGraphsTopic.id,
      explanation: "# Graphs\n\nBFS for shortest path, DFS for exploration.",
      template: "def bfs(graph, start):\n    queue = [start]\n    visited = {start}\n    while queue:\n        node = queue.pop(0)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)",
      isPremium: false,
    },
  });
  console.log("Created pattern:", graphsPattern.title);

  // 1D DP Pattern
  const dp1DPattern = await prismaClient.pattern.upsert({
    where: { slug: "1d-dp" },
    update: {},
    create: {
      slug: "1d-dp",
      title: "1D Dynamic Programming",
      description: "Single dimension state transitions.",
      order: 1,
      topicId: dpTopic.id,
      explanation: "# 1D DP\n\nUse for linear sequences like Fibonacci, climbing stairs.",
      template: "def solve(n):\n    dp = [0] * (n + 1)\n    dp[0] = base_case\n    for i in range(1, n + 1):\n        dp[i] = transition(dp[i-1], ...)\n    return dp[n]",
      isPremium: false,
    },
  });
  console.log("Created pattern:", dp1DPattern.title);

  // 2D DP Pattern
  const dp2DPattern = await prismaClient.pattern.upsert({
    where: { slug: "2d-dp" },
    update: {},
    create: {
      slug: "2d-dp",
      title: "2D Dynamic Programming",
      description: "Two-dimensional state transitions.",
      order: 2,
      topicId: dpTopic.id,
      explanation: "# 2D DP\n\nUse for grids, string comparisons, and knapsack.",
      template: "def solve(m, n):\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            dp[i][j] = transition(dp[i-1][j], dp[i][j-1], ...)\n    return dp[m][n]",
      isPremium: false,
    },
  });
  console.log("Created pattern:", dp2DPattern.title);

  // Intervals Pattern
  const intervalsPattern = await prismaClient.pattern.upsert({
    where: { slug: "intervals" },
    update: {},
    create: {
      slug: "intervals",
      title: "Intervals",
      description: "Merge, insert, and schedule overlapping intervals.",
      order: 1,
      topicId: advancedTopic.id,
      explanation: "# Intervals\n\nSort by start/end time and process intervals.",
      template: "def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged",
      isPremium: false,
    },
  });
  console.log("Created pattern:", intervalsPattern.title);

  // Greedy Pattern
  const greedyPattern = await prismaClient.pattern.upsert({
    where: { slug: "greedy" },
    update: {},
    create: {
      slug: "greedy",
      title: "Greedy",
      description: "Make locally optimal choices for global optimum.",
      order: 2,
      topicId: advancedTopic.id,
      explanation: "# Greedy\n\nMake the best local choice at each step.",
      template: "def solve(items):\n    items.sort(key=lambda x: criteria)\n    result = 0\n    for item in items:\n        if can_take(item):\n            result += item.value\n    return result",
      isPremium: false,
    },
  });
  console.log("Created pattern:", greedyPattern.title);

  // Tries Pattern
  const triesPattern = await prismaClient.pattern.upsert({
    where: { slug: "tries" },
    update: {},
    create: {
      slug: "tries",
      title: "Tries",
      description: "Prefix tree for string matching and autocomplete.",
      order: 3,
      topicId: advancedTopic.id,
      explanation: "# Tries\n\nEfficient prefix operations on strings.",
      template: "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    \n    def insert(self, word):\n        node = self.root\n        for c in word:\n            node = node.children.setdefault(c, TrieNode())\n        node.is_end = True",
      isPremium: false,
    },
  });
  console.log("Created pattern:", triesPattern.title);

  // Bit Manipulation Pattern
  const bitPattern = await prismaClient.pattern.upsert({
    where: { slug: "bit-manipulation" },
    update: {},
    create: {
      slug: "bit-manipulation",
      title: "Bit Manipulation",
      description: "Binary operations for optimization.",
      order: 4,
      topicId: advancedTopic.id,
      explanation: "# Bit Manipulation\n\nUse XOR, AND, OR for efficient operations.",
      template: "# XOR properties:\n# a ^ a = 0\n# a ^ 0 = a\n# Get bit: (n >> i) & 1\n# Set bit: n | (1 << i)\n# Clear bit: n & ~(1 << i)",
      isPremium: false,
    },
  });
  console.log("Created pattern:", bitPattern.title);

  // Math Pattern
  const mathPattern = await prismaClient.pattern.upsert({
    where: { slug: "math-geometry" },
    update: {},
    create: {
      slug: "math-geometry",
      title: "Math & Geometry",
      description: "Mathematical algorithms and matrix operations.",
      order: 5,
      topicId: advancedTopic.id,
      explanation: "# Math & Geometry\n\nMatrix operations, modular arithmetic, and more.",
      template: "# Rotate matrix 90 degrees clockwise:\n# 1. Transpose\n# 2. Reverse each row",
      isPremium: false,
    },
  });
  console.log("Created pattern:", mathPattern.title);

  // Advanced Graphs Pattern
  const advancedGraphsPattern = await prismaClient.pattern.upsert({
    where: { slug: "advanced-graphs" },
    update: {},
    create: {
      slug: "advanced-graphs",
      title: "Advanced Graphs",
      description: "Union-Find, Dijkstra, topological sort.",
      order: 6,
      topicId: advancedTopic.id,
      explanation: "# Advanced Graphs\n\nUnion-Find for connectivity, Dijkstra for shortest paths.",
      template: "class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n    \n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n    \n    def union(self, x, y):\n        px, py = self.find(x), self.find(y)\n        if px == py:\n            return False\n        if self.rank[px] < self.rank[py]:\n            px, py = py, px\n        self.parent[py] = px\n        if self.rank[px] == self.rank[py]:\n            self.rank[px] += 1\n        return True",
      isPremium: false,
    },
  });
  console.log("Created pattern:", advancedGraphsPattern.title);

  // ======== SAMPLE PROBLEMS ========

  // Two Sum
  await prismaClient.problem.upsert({
    where: { slug: "two-sum" },
    update: {},
    create: {
      slug: "two-sum",
      title: "Two Sum",
      difficulty: "easy",
      patternId: arraysHashingPattern.id,
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      constraints: "- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9",
      examples: JSON.stringify([{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }]),
      hints: JSON.stringify(["Use a hash map for O(1) lookups"]),
      solutions: JSON.stringify([{
        approach: "Hash Map",
        complexity: { time: "O(n)", space: "O(n)" },
        code: { python: "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []" }
      }]),
      starterCode: JSON.stringify({ python: "def twoSum(nums, target):\n    pass" }),
      testCases: JSON.stringify([{ input: "[2,7,11,15]\n9", output: "[0,1]", isHidden: false }]),
      estimatedMinutes: 15,
      xpReward: 10,
      isPremium: false,
      isPublished: true,
    },
  });

  // Valid Parentheses
  await prismaClient.problem.upsert({
    where: { slug: "valid-parentheses" },
    update: {},
    create: {
      slug: "valid-parentheses",
      title: "Valid Parentheses",
      difficulty: "easy",
      patternId: stackPattern.id,
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      constraints: "- 1 <= s.length <= 10^4",
      examples: JSON.stringify([{ input: 's = "()"', output: "true" }]),
      hints: JSON.stringify(["Use a stack to track opening brackets"]),
      solutions: JSON.stringify([{
        approach: "Stack",
        complexity: { time: "O(n)", space: "O(n)" },
        code: { python: "def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in mapping:\n            if not stack or stack.pop() != mapping[c]:\n                return False\n        else:\n            stack.append(c)\n    return not stack" }
      }]),
      starterCode: JSON.stringify({ python: "def isValid(s):\n    pass" }),
      testCases: JSON.stringify([{ input: '"()"', output: "true", isHidden: false }]),
      estimatedMinutes: 15,
      xpReward: 10,
      isPremium: false,
      isPublished: true,
    },
  });

  // Valid Palindrome
  await prismaClient.problem.upsert({
    where: { slug: "valid-palindrome" },
    update: {},
    create: {
      slug: "valid-palindrome",
      title: "Valid Palindrome",
      difficulty: "easy",
      patternId: twoPointersPattern.id,
      description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      constraints: "- 1 <= s.length <= 2 * 10^5",
      examples: JSON.stringify([{ input: 's = "A man, a plan, a canal: Panama"', output: "true" }]),
      hints: JSON.stringify(["Use two pointers from both ends"]),
      solutions: JSON.stringify([{
        approach: "Two Pointers",
        complexity: { time: "O(n)", space: "O(1)" },
        code: { python: "def isPalindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True" }
      }]),
      starterCode: JSON.stringify({ python: "def isPalindrome(s):\n    pass" }),
      testCases: JSON.stringify([{ input: '"A man, a plan, a canal: Panama"', output: "true", isHidden: false }]),
      estimatedMinutes: 15,
      xpReward: 10,
      isPremium: false,
      isPublished: true,
    },
  });

  // Reverse Linked List
  await prismaClient.problem.upsert({
    where: { slug: "reverse-linked-list" },
    update: {},
    create: {
      slug: "reverse-linked-list",
      title: "Reverse Linked List",
      difficulty: "easy",
      patternId: linkedListPattern.id,
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      constraints: "- The number of nodes in the list is the range [0, 5000].",
      examples: JSON.stringify([{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }]),
      hints: JSON.stringify(["Track prev, curr, and next pointers"]),
      solutions: JSON.stringify([{
        approach: "Iterative",
        complexity: { time: "O(n)", space: "O(1)" },
        code: { python: "def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev" }
      }]),
      starterCode: JSON.stringify({ python: "def reverseList(head):\n    pass" }),
      testCases: JSON.stringify([{ input: "[1,2,3,4,5]", output: "[5,4,3,2,1]", isHidden: false }]),
      estimatedMinutes: 15,
      xpReward: 10,
      isPremium: false,
      isPublished: true,
    },
  });

  // Climbing Stairs
  await prismaClient.problem.upsert({
    where: { slug: "climbing-stairs" },
    update: {},
    create: {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      difficulty: "easy",
      patternId: dp1DPattern.id,
      description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      constraints: "- 1 <= n <= 45",
      examples: JSON.stringify([{ input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" }]),
      hints: JSON.stringify(["This is the Fibonacci sequence"]),
      solutions: JSON.stringify([{
        approach: "Dynamic Programming",
        complexity: { time: "O(n)", space: "O(1)" },
        code: { python: "def climbStairs(n):\n    if n <= 2:\n        return n\n    prev2, prev1 = 1, 2\n    for i in range(3, n + 1):\n        curr = prev1 + prev2\n        prev2 = prev1\n        prev1 = curr\n    return prev1" }
      }]),
      starterCode: JSON.stringify({ python: "def climbStairs(n):\n    pass" }),
      testCases: JSON.stringify([{ input: "3", output: "3", isHidden: false }]),
      estimatedMinutes: 10,
      xpReward: 10,
      isPremium: false,
      isPublished: true,
    },
  });

  console.log("\n✅ Seed completed successfully!");
  console.log("   Created 4 topics, 18 patterns, and 5 sample problems");
}

run()
  .then(() => {
    console.log("Database seeded!");
    prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error:", e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
