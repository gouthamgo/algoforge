import { HttpError } from "wasp/server";
import type {
  GetPendingCelebrations,
  GetCelebration,
  MarkCelebrationSeen,
  ShareCelebration,
} from "wasp/server/operations";
import { CELEBRATION_MESSAGES, getLevelTitle } from "../gamification/constants";

// ============== GET PENDING CELEBRATIONS ==============
// Returns celebrations that haven't been seen yet
// TODO: Re-enable after migration is complete
export const getPendingCelebrations: GetPendingCelebrations<void, any> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  // Temporarily return empty array until Celebration entity is available
  return [];
};

// ============== GET CELEBRATION ==============
// Get a specific celebration by ID (for shareable page)
// TODO: Re-enable after migration is complete
export const getCelebration: GetCelebration<any, any> = async (
  args,
  context
) => {
  // Temporarily return null until Celebration entity is available
  return null;
};

// ============== MARK CELEBRATION SEEN ==============
// TODO: Re-enable after migration is complete
export const markCelebrationSeen: MarkCelebrationSeen<{ celebrationId: string }, { success: boolean }> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  // Temporarily return success until Celebration entity is available
  return { success: true };
};

// ============== SHARE CELEBRATION ==============
// TODO: Re-enable after migration is complete
export const shareCelebration: ShareCelebration<any, any> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  // Temporarily return stub data until Celebration entity is available
  return {
    success: true,
    shareUrl: "",
    shareText: "",
  };
};

// ============== TYPES ==============
interface PendingCelebration {
  id: string;
  type: string;
  referenceId: string | null;
  xpAwarded: number;
  createdAt: Date;
  message: string;
  achievement: {
    title: string;
    description: string;
    iconName: string;
    iconEmoji: string | null;
    rarity: string;
    xpReward: number;
  } | null;
  levelInfo: {
    title: string;
    emoji: string;
    description: string;
  } | null;
}

interface CelebrationDetails {
  id: string;
  type: string;
  referenceId: string | null;
  xpAwarded: number;
  createdAt: Date;
  sharedAt: Date | null;
  user: {
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    level: number;
    levelInfo: {
      title: string;
      emoji: string;
      description: string;
    };
  };
  message: string;
  achievement: {
    title: string;
    description: string;
    iconName: string;
    iconEmoji: string | null;
    rarity: string;
    xpReward: number;
  } | null;
}

interface ShareCelebrationInput {
  celebrationId: string;
  platform: "twitter" | "linkedin" | "facebook" | "reddit" | "link";
}

interface ShareCelebrationResult {
  success: boolean;
  shareUrl: string;
  shareText: string;
}
