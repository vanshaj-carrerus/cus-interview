/**
 * Set LEARNING_PROGRESS_DEBUG=1 and/or NEXT_PUBLIC_LEARNING_PROGRESS_DEBUG=1 (e.g. on Vercel)
 * to log learning / tracking diagnostics in server routes and the browser console.
 */
export function learningProgressDebugEnabled(): boolean {
  return (
    process.env.LEARNING_PROGRESS_DEBUG === "1" ||
    process.env.NEXT_PUBLIC_LEARNING_PROGRESS_DEBUG === "1"
  );
}

/**
 * Browser: always logs so you can trace progress/attempts in DevTools without env vars.
 * Server: only when LEARNING_PROGRESS_DEBUG / NEXT_PUBLIC_LEARNING_PROGRESS_DEBUG is set.
 */
export function logLearningProgress(
  source: string,
  message: string,
  data?: Record<string, unknown>,
): void {
  if (typeof window !== "undefined") {
    if (data !== undefined) {
      console.info(`[cus-learning:${source}]`, message, data);
    } else {
      console.info(`[cus-learning:${source}]`, message);
    }
    return;
  }
  if (!learningProgressDebugEnabled()) return;
  if (data !== undefined) {
    console.log(`[learning-progress:${source}]`, message, data);
  } else {
    console.log(`[learning-progress:${source}]`, message);
  }
}
