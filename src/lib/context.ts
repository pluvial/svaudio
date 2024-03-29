import { getContext, setContext } from 'svelte';
import { get, type Readable } from 'svelte/store';

export interface Ctx {
	audioCtx: AudioContext;
	output: AudioNode;
	state: Readable<AudioContextState>;
}

export const key = Symbol();

export const getCtx = () => validate(getContext<Ctx>(key));

export const setCtx = (c: Ctx) => setContext<Ctx>(key, c);

export function setCtxProp<T extends keyof Ctx>(k: T, value: Ctx[T]) {
	const ctx = getCtx();
	setCtx({ ...ctx, [k]: value });
}

function validate(ctx: Partial<Ctx>): Ctx {
	if (!ctx.audioCtx || !ctx.output) throw new Error('AudioContext not created');
	if (!ctx.state || get(ctx.state) !== 'running') throw new Error('AudioContext not running');
	return ctx as Ctx;
}

export const setCtxOutput = (node: AudioNode) => setCtxProp('output', node);
