import { writable } from "svelte/store";



export const SessionManager = writable({
    is_connected: false,
    username: null,
    token: null
})