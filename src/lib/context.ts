import { getContext, setContext } from 'svelte';
import { get, type Readable } from 'svelte/store';

export interface Ctx {
	audioCtx: AudioContext;
	state: Readable<AudioContextState>;
}

export const key = Symbol();

export const getCtx = () => validate(getContext<Ctx>(key));

export const setCtx = (c: Ctx) => setContext<Ctx>(key, c);

function validate(ctx: Partial<Ctx>): Ctx {
	if (!ctx.audioCtx) throw new Error('AudioContext not created');
	if (!ctx.state || get(ctx.state) !== 'running') throw new Error('AudioContext not running');
	return ctx as Ctx;
}
