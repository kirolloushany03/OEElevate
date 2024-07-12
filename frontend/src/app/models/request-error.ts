import { HttpStatusCode } from "@angular/common/http";

export interface RequestError {
  status: HttpStatusCode,
  message: string
}

export type MaybeErorr<T> = (T & Partial<{
  error: RequestError
}>) | (Partial<T> & {
  error: RequestError
}) | null
