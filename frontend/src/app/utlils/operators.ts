import { tap } from "rxjs";

export type Serializable = string | number | boolean | null | undefined | Serializable[] | { [key: string]: Serializable }

export const log = (message:string, transform?:(val: unknown) => string) => tap({
    next: (val) => console.log(message, transform ? transform(val) : val),
    error: (err) => console.error(message, err)
})

export const storeLocally = (key:string) => tap({
    next: (data: Serializable) => localStorage.setItem(key, JSON.stringify(data)),
    error: () => localStorage.removeItem(key)
})
