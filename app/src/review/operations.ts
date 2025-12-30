import { type AuthUser } from "wasp/auth";
import { HttpError } from "wasp/server";

// Context for getReviewQueue - entities: [ReviewQueueItem, Problem]
type GetReviewQueueContext = {
  user?: AuthUser;
  entities: {
    ReviewQueueItem: any;
    Problem: any;
  };
};

// Context for completeReview - entities: [ReviewQueueItem, UserProblemProgress]
type CompleteReviewContext = {
  user?: AuthUser;
  entities: {
    ReviewQueueItem: any;
    UserProblemProgress: any;
  };
};

export const getReviewQueue = async (_args: void, context: GetReviewQueueContext) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { ReviewQueueItem } = context.entities;

  const items = await ReviewQueueItem.findMany({
    where: {
      userId: context.user.id,
      dueDate: { lte: new Date() },
    },
    include: {
      problem: {
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          pattern: { select: { title: true } },
        },
      },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
    take: 20,
  });

  return items;
};

export const completeReview = async (
  args: { problemId: string; quality: number },
  context: CompleteReviewContext
) => {
  if (!context.user) {
    throw new HttpError(401, "Not authenticated");
  }

  const { ReviewQueueItem, UserProblemProgress } = context.entities;

  // Get current progress
  const progress = await UserProblemProgress.findUnique({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: args.problemId,
      },
    },
  });

  if (!progress) {
    throw new HttpError(404, "Progress not found");
  }

  // SM-2 Algorithm
  const quality = Math.max(0, Math.min(5, args.quality));
  let easeFactor = progress.easeFactor || 2.5;
  let interval = progress.interval || 1;

  if (quality >= 3) {
    // Correct response
    if (progress.interval === 1) {
      interval = 1;
    } else if (progress.interval === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
  } else {
    // Incorrect response - reset
    interval = 1;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  // Update progress
  await UserProblemProgress.update({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: args.problemId,
      },
    },
    data: {
      easeFactor,
      interval,
      nextReviewDate,
    },
  });

  // Update review queue item
  await ReviewQueueItem.update({
    where: {
      userId_problemId: {
        userId: context.user.id,
        problemId: args.problemId,
      },
    },
    data: {
      dueDate: nextReviewDate,
      lastReviewQuality: quality,
    },
  });

  return { success: true, nextReviewDate, interval };
};
