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

export function logLearningProgress(
  source: string,
  message: string,
  data?: Record<string, unknown>,
): void {
  if (!learningProgressDebugEnabled()) return;
  if (data !== undefined) {
    console.log(`[learning-progress:${source}]`, message, data);
  } else {
    console.log(`[learning-progress:${source}]`, message);
  }
}
