import { getContext, setContext } from 'svelte';

export interface Ctx {
	get: () => AudioContext;
	resumed: () => boolean;
}

export const key = Symbol();

export const getCtx = () => getContext<Ctx>(key);

export const setCtx = (c: Ctx) => setContext<Ctx>(key, c);

export function validate() {
	const ctx = getCtx();
	if (!ctx.get()) throw new Error('AudioContext not created');
	if (!ctx.resumed()) throw new Error('AudioContext not resumed');
}
