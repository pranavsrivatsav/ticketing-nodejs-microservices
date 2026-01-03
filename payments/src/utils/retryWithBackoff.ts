/**
 * Retry utility with exponential backoff intervals
 * 
 * @template T - The type of the result returned by the callback
 * @param callback - Async function to execute and retry
 * @param intervals - Array of intervals in milliseconds for backoff. After exhausting the array, the last interval is used for subsequent retries
 * @param maxRetries - Maximum number of retries (total attempts = maxRetries + 1 initial attempt)
 * @param validator - Function that validates if the result is successful. Returns true if successful, false otherwise
 * @returns Object containing the result, whether it was successful, and whether it was the final attempt
 */
export async function retryWithBackoff<T>(
  callback: () => Promise<T>,
  intervals: number[],
  maxRetries: number,
  validator: (result: T) => boolean
): Promise<{
  result: T;
  isSuccessful: boolean;
  isFinalAttempt: boolean;
  attemptNumber: number;
}> {
  if (intervals.length === 0) {
    throw new Error("Intervals array cannot be empty");
  }

  if (maxRetries < 0) {
    throw new Error("maxRetries must be non-negative");
  }

  let attemptNumber = 0;
  const totalAttempts = maxRetries + 1;

  while (attemptNumber < totalAttempts) {
    attemptNumber++;
    const isFinalAttempt = attemptNumber === totalAttempts;

    try {
      const result = await callback();
      const isSuccessful = validator(result);

      // If successful or it's the final attempt, return the result
      if (isSuccessful || isFinalAttempt) {
        return {
          result,
          isSuccessful,
          isFinalAttempt,
          attemptNumber,
        };
      }

      // If not successful and not final attempt, wait and retry
      if (!isFinalAttempt) {
        // Use interval from array, or the last interval if we've exhausted the array
        const intervalIndex = Math.min(attemptNumber - 1, intervals.length - 1);
        const interval = intervals[intervalIndex];
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    } catch (error) {
      // If it's the final attempt, throw the error
      if (isFinalAttempt) {
        throw error;
      }

      // Otherwise, wait and retry
      const intervalIndex = Math.min(attemptNumber - 1, intervals.length - 1);
      const interval = intervals[intervalIndex];
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  // This should never be reached, but TypeScript requires it
  throw new Error("Unexpected error in retryWithBackoff");
}

