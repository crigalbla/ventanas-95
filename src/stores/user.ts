import { writable } from "svelte/store"

export type UserType = {
  userName?: string,
  isLoggedIn?: boolean,
}

const state: UserType = {}

export const user = writable(state)
