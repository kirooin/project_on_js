export type RequestResultType<T = unknown> = {
    response: T;
    error?: boolean;
    redirect?: string;
}