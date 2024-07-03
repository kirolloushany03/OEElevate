import { tap } from "rxjs";

export const log = (message:string, transform?:(val:any) => string) => tap({
    next: (val) => console.log(message, transform ? transform(val) : val),
    error: (err) => console.error(message, err)
})

export const storeLocally = (key:string) => tap({
    next: (data:any) => localStorage.setItem(key, JSON.stringify(data)),
    error: () => localStorage.removeItem(key)
})
