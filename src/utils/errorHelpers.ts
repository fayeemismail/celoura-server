


export function extractErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unexpected error EXT"
}