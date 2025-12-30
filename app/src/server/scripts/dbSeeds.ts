import { faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";
import { type User } from "wasp/entities";
import {
  getSubscriptionPaymentPlanIds,
  SubscriptionStatus,
} from "../../payment/plans";

type MockUserData = Omit<User, "id">;

/**
 * Seeds the database with lesson content (Topics, Patterns, Problems)
 * Run with: wasp db seed
 */
export async function seedLessonContent(prismaClient: PrismaClient) {
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
- **Time & Space Complexity**: Understanding Big O notation

## Why Start Here?

Over 80% of coding interview problems involve arrays or hash maps in some way. Mastering these fundamentals will give you the tools to tackle more advanced patterns later.

## Prerequisites

- Basic programming knowledge (variables, loops, functions)
- Familiarity with at least one programming language

Let's begin!`,
      estimatedHours: 10,
      difficulty: "beginner",
      isPublished: true,
      isPremium: false,
    },
  });

  // Create Pattern: Arrays & Hashing
  const arraysHashingPattern = await prismaClient.pattern.upsert({
    where: { slug: "arrays-hashing" },
    update: {},
    create: {
      slug: "arrays-hashing",
      title: "Arrays & Hashing",
      description: "Foundation of all DSA. Hash maps for O(1) lookups.",
      order: 1,
      topicId: fundamentalsTopic.id,
      explanation: `# Arrays & Hashing Pattern

## When to Use This Pattern

Use arrays and hash maps when you need to:
- Store and access elements by index (arrays)
- Look up values in O(1) time (hash maps)
- Count occurrences of elements
- Find pairs or groups with specific properties

## Key Techniques

### 1. Hash Map for Fast Lookups
Instead of nested loops (O(n²)), use a hash map to store seen values for O(1) lookups.

### 2. Frequency Counting
Count occurrences of elements using a hash map to solve problems involving duplicates or majority elements.

### 3. Two-Pass vs One-Pass
Sometimes you need to scan the array twice; other times, you can solve it in one pass by building the hash map as you go.

## Time Complexity
- Array access: O(1)
- Hash map insert/lookup: O(1) average
- Iteration: O(n)

## Common Mistakes
- Not handling edge cases (empty array, single element)
- Using nested loops when a hash map would be more efficient
- Forgetting that hash map operations can be O(n) in worst case`,
      template: `# Python Template for Arrays & Hashing

def solve(nums):
    # Hash map for O(1) lookups
    seen = {}

    for i, num in enumerate(nums):
        # Check if complement/target exists
        if target_condition in seen:
            return result

        # Store current element
        seen[num] = i

    return default_result`,
      isPremium: false,
    },
  });

  // Create Problem: Two Sum
  await prismaClient.problem.upsert({
    where: { slug: "two-sum" },
    update: {},
    create: {
      slug: "two-sum",
      title: "Two Sum",
      difficulty: "easy",
      patternId: arraysHashingPattern.id,
      description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
      constraints: `- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
      examples: JSON.stringify([
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
        },
        {
          input: "nums = [3,3], target = 6",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
        },
      ]),
      hints: JSON.stringify([
        "Think about what you need to find for each element.",
        "For each number, you need to find if (target - number) exists in the array.",
        "A hash map can help you check existence in O(1) time.",
        "You can build the hash map as you iterate, checking for complements along the way.",
      ]),
      solutions: JSON.stringify([
        {
          approach: "Brute Force",
          complexity: { time: "O(n²)", space: "O(1)" },
          code: {
            python: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
            javascript: `function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
          },
          explanation: "Check every pair of numbers. Simple but slow - O(n²) time complexity.",
        },
        {
          approach: "Hash Map (Optimal)",
          complexity: { time: "O(n)", space: "O(n)" },
          code: {
            python: `def twoSum(nums, target):
    seen = {}
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
          explanation: "For each number, check if its complement (target - num) exists in the hash map. We trade space for time, achieving O(n) complexity.",
        },
      ]),
      starterCode: JSON.stringify({
        python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Your code here
    pass`,
        javascript: `function twoSum(nums, target) {
    // Your code here
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
}`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
      }),
      testCases: JSON.stringify([
        { input: "[2,7,11,15]\n9", output: "[0,1]", isHidden: false },
        { input: "[3,2,4]\n6", output: "[1,2]", isHidden: false },
        { input: "[3,3]\n6", output: "[0,1]", isHidden: false },
        { input: "[1,2,3,4,5]\n9", output: "[3,4]", isHidden: true },
        { input: "[-1,-2,-3,-4,-5]\n-8", output: "[2,4]", isHidden: true },
      ]),
      estimatedMinutes: 15,
      xpReward: 10,
      isPremium: false,
      isPublished: true,
    },
  });

  // Add company tags for the problem
  const problem = await prismaClient.problem.findUnique({
    where: { slug: "two-sum" },
  });

  if (problem) {
    const companies = [
      { companyName: "Google", frequency: 5 },
      { companyName: "Amazon", frequency: 5 },
      { companyName: "Meta", frequency: 4 },
      { companyName: "Microsoft", frequency: 4 },
      { companyName: "Apple", frequency: 3 },
    ];

    for (const company of companies) {
      await prismaClient.problemCompany.upsert({
        where: {
          problemId_companyName: {
            problemId: problem.id,
            companyName: company.companyName,
          },
        },
        update: { frequency: company.frequency },
        create: {
          problemId: problem.id,
          companyName: company.companyName,
          frequency: company.frequency,
        },
      });
    }
  }

  console.log("✅ Lesson content seeded successfully!");
  console.log("   - Topic: Fundamentals");
  console.log("   - Pattern: Arrays & Hashing");
  console.log("   - Problem: Two Sum");
}

/**
 * This function, which we've imported in `app.db.seeds` in the `main.wasp` file,
 * seeds the database with mock users via the `wasp db seed` command.
 * For more info see: https://wasp.sh/docs/data-model/backends#seeding-the-database
 */
export async function seedMockUsers(prismaClient: PrismaClient) {
  await Promise.all(
    generateMockUsersData(50).map((data) => prismaClient.user.create({ data })),
  );
}

function generateMockUsersData(numOfUsers: number): MockUserData[] {
  return faker.helpers.multiple(generateMockUserData, { count: numOfUsers });
}

function generateMockUserData(): MockUserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const subscriptionStatus =
    faker.helpers.arrayElement<SubscriptionStatus | null>([
      ...Object.values(SubscriptionStatus),
      null,
    ]);
  const now = new Date();
  const createdAt = faker.date.past({ refDate: now });
  const timePaid = faker.date.between({ from: createdAt, to: now });
  const credits = subscriptionStatus
    ? 0
    : faker.number.int({ min: 0, max: 10 });
  const hasUserPaidOnStripe = !!subscriptionStatus || credits > 3;
  const currentStreak = faker.number.int({ min: 0, max: 30 });
  return {
    email: faker.internet.email({ firstName, lastName }),
    username: faker.internet.userName({ firstName, lastName }),
    displayName: `${firstName} ${lastName}`,
    avatarUrl: null,
    createdAt,
    isAdmin: false,
    credits,
    subscriptionStatus,
    lemonSqueezyCustomerPortalUrl: null,
    paymentProcessorUserId: hasUserPaidOnStripe
      ? `cus_test_${faker.string.uuid()}`
      : null,
    datePaid: hasUserPaidOnStripe
      ? faker.date.between({ from: createdAt, to: timePaid })
      : null,
    subscriptionPlan: subscriptionStatus
      ? faker.helpers.arrayElement(getSubscriptionPaymentPlanIds())
      : null,
    currentStreak,
    longestStreak: faker.number.int({ min: currentStreak, max: currentStreak + 20 }),
    totalXp: faker.number.int({ min: 0, max: 5000 }),
    level: faker.number.int({ min: 1, max: 20 }),
    preferredLanguage: faker.helpers.arrayElement(["python", "javascript", "java", "cpp"]),
    dailyGoal: faker.helpers.arrayElement([1, 2, 3, 5, 10]),
    lastActiveDate: faker.helpers.arrayElement([faker.date.recent(), null]),
  };
}
