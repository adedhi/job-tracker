export function logError(context: string, error: unknown) {
    if (error instanceof Error) {
        console.error(`[${context}]`, error.message, error.stack);
    } else {
        console.error(`[${context}]`, error);
    }
}
