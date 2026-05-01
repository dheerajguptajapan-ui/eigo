export interface SRSState {
  interval_days: number;
  ease_factor: number;
  review_count: number;
  due_date: Date;
}

export const calculateNextSRSState = (
  rating: number, // 1: Again, 2: Hard, 3: Good, 4: Easy
  currentState: SRSState
): SRSState => {
  let { interval_days, ease_factor, review_count } = currentState;
  const now = new Date();

  // Initial values for a new card if not provided correctly
  if (review_count === 0) {
    interval_days = 1;
    ease_factor = 2.5;
  }

  if (rating === 1) {
    // Again
    interval_days = 1;
    ease_factor = Math.max(1.3, ease_factor - 0.2);
  } else if (rating === 2) {
    // Hard
    interval_days = interval_days * 1.2;
  } else if (rating === 3) {
    // Good
    interval_days = interval_days * ease_factor;
  } else if (rating === 4) {
    // Easy
    interval_days = interval_days * ease_factor * 1.3;
    ease_factor = Math.min(2.5, ease_factor + 0.15);
  }

  // Ensure interval is at least 1 day
  interval_days = Math.max(1, Math.round(interval_days * 100) / 100);

  const nextDueDate = new Date(now);
  nextDueDate.setDate(now.getDate() + Math.ceil(interval_days));

  return {
    interval_days,
    ease_factor,
    review_count: review_count + 1,
    due_date: nextDueDate,
  };
};
