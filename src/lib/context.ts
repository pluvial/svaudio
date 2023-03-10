import { getContext, setContext } from 'svelte';
import { get, type Readable } from 'svelte/store';

export interface Ctx {
	audioCtx: AudioContext;
	state: Readable<AudioContextState>;
}

export const key = Symbol();

export const getCtx = () => getContext<Ctx>(key);

export const setCtx = (c: Ctx) => setContext<Ctx>(key, c);

export function validate() {
	const ctx = getCtx();
	if (!ctx.audioCtx) throw new Error('AudioContext not created');
	if (get(ctx.state) !== 'running') throw new Error('AudioContext not running');
}
