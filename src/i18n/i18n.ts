import { derived, writable } from "svelte/store"
import translations from "./translations"
import type { Writable } from "svelte/store"

interface TranslationVars {
  [key: string]: string;
}

const translate = (locale: string, key: string, vars: TranslationVars) => {
	if (!key) throw new Error("no key provided to $t()")
	if (!locale) throw new Error(`no translation for key "${key}"`)

	let text = translations[locale][key]

	if (!text) throw new Error(`no translation found for ${locale}.${key}`)

	Object.keys(vars).forEach((k) => {
		const regex = new RegExp(`{{${k}}}`, "g")
		text = text.replace(regex, vars[k])
	})

	return text
}

export const locale: Writable<string> = writable("es")
export const locales: string[] = Object.keys(translations)
export const t = derived(locale, ($locale) => (key: string, vars: TranslationVars = {}) => {
	try {
		return translate($locale, key, vars)
	} catch (error) {
		return key
	}
})
export const translateKey = (key: string) => {
	let result = ""
	const unsubscribe = t.subscribe((tr) => result = tr(key))
	unsubscribe()

	return result
}
