import { HttpError } from "wasp/server";
import type {
  GetOnboardingStatus,
  CompleteOnboarding,
} from "wasp/server/operations";
import { GOAL_PRIORITIES } from "../gamification/constants";

// ============== GET ONBOARDING STATUS ==============
export const getOnboardingStatus: GetOnboardingStatus<void, any> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id },
    select: {
      hasCompletedOnboarding: true,
      onboardingGoal: true,
      experienceLevel: true,
      timeCommitment: true,
      onboardingCompletedAt: true,
      displayName: true,
      username: true,
    },
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return {
    hasCompletedOnboarding: user.hasCompletedOnboarding,
    onboardingGoal: user.onboardingGoal,
    experienceLevel: user.experienceLevel,
    timeCommitment: user.timeCommitment,
    onboardingCompletedAt: user.onboardingCompletedAt,
    displayName: user.displayName,
    username: user.username,
  };
};

// ============== COMPLETE ONBOARDING ==============
export const completeOnboarding: CompleteOnboarding<any, any> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { goal, experienceLevel, timeCommitment } = args;

  // Validate inputs
  if (!goal || !["career", "startup", "upskill", "curious"].includes(goal)) {
    throw new HttpError(400, "Invalid goal selection");
  }
  if (!experienceLevel || !["beginner", "intermediate", "advanced"].includes(experienceLevel)) {
    throw new HttpError(400, "Invalid experience level");
  }
  if (!timeCommitment || !["15min", "30min", "1hour", "weekends"].includes(timeCommitment)) {
    throw new HttpError(400, "Invalid time commitment");
  }

  // Get recommended daily goal based on onboarding selections
  const goalPriority = GOAL_PRIORITIES[goal];
  let suggestedDailyGoal = goalPriority?.dailyGoalSuggestion || 3;

  // Adjust based on experience level
  if (experienceLevel === "beginner") {
    suggestedDailyGoal = Math.max(1, suggestedDailyGoal - 1);
  } else if (experienceLevel === "advanced") {
    suggestedDailyGoal = Math.min(10, suggestedDailyGoal + 1);
  }

  // Adjust based on time commitment
  if (timeCommitment === "15min") {
    suggestedDailyGoal = Math.max(1, Math.min(suggestedDailyGoal, 2));
  } else if (timeCommitment === "weekends") {
    suggestedDailyGoal = Math.max(1, Math.min(suggestedDailyGoal, 3));
  }

  // Update user with onboarding data
  const updatedUser = await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      hasCompletedOnboarding: true,
      onboardingGoal: goal,
      experienceLevel,
      timeCommitment,
      onboardingCompletedAt: new Date(),
      dailyGoal: suggestedDailyGoal,
    },
    select: {
      hasCompletedOnboarding: true,
      onboardingGoal: true,
      experienceLevel: true,
      timeCommitment: true,
      dailyGoal: true,
    },
  });

  // Get recommended patterns based on goal
  const recommendedPatterns = goalPriority?.patterns || ["arrays-hashing"];

  return {
    success: true,
    user: updatedUser,
    recommendations: {
      dailyGoal: suggestedDailyGoal,
      priorityPatterns: recommendedPatterns,
      pace: goalPriority?.pace || "moderate",
    },
  };
};

// ============== TYPES ==============
interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  onboardingGoal: string | null;
  experienceLevel: string | null;
  timeCommitment: string | null;
  onboardingCompletedAt: Date | null;
  displayName: string | null;
  username: string | null;
}

interface CompleteOnboardingInput {
  goal: string;
  experienceLevel: string;
  timeCommitment: string;
}

interface CompleteOnboardingResult {
  success: boolean;
  user: {
    hasCompletedOnboarding: boolean;
    onboardingGoal: string | null;
    experienceLevel: string | null;
    timeCommitment: string | null;
    dailyGoal: number;
  };
  recommendations: {
    dailyGoal: number;
    priorityPatterns: string[];
    pace: string;
  };
}
