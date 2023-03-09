import { getContext, setContext } from 'svelte';

export interface Ctx {
	get: () => AudioContext;
}

export const key = Symbol();

export const getCtx = () => getContext<Ctx>(key);

export const setCtx = (c: Ctx) => setContext<Ctx>(key, c);
