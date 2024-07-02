import { tap } from "rxjs";

export const storeLocally = (key:string) => tap({
    next: (data:any) => localStorage.setItem(key, JSON.stringify(data)),
    error: () => localStorage.removeItem(key)
})
