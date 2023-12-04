export interface ExpressError extends Error {
  status: number;
  type: string;
  message: string;
}
