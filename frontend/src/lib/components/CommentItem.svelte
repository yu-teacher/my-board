<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CommentView } from '$lib/types';
	import { authStore } from '$lib/stores/auth';

	export let comment: CommentView;
	export let isReply = comment.isReply;

	const dispatch = createEventDispatcher<{
		reply: CommentView;
		delete: CommentView;
	}>();
</script>

<div class="border-l-2 border-gray-700 pl-4 py-2 {isReply ? 'ml-4 sm:ml-8' : ''}">
	<div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
		<div>
			<span class="font-semibold text-gray-200">{comment.nickname}</span>
			<span class="text-gray-400 text-sm ml-2">
				<span>{new Date(comment.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</span>
			</span>
		</div>
		<div class="flex gap-2">
			{#if !isReply}
				<button
					class="text-blue-400 hover:text-blue-300 text-sm"
					on:click={() => dispatch('reply', comment)}
				>
					답글
				</button>
			{/if}
			<button
				class="{$authStore
					? 'text-red-400 hover:text-red-300'
					: 'text-gray-400 hover:text-gray-300'} text-sm"
				on:click={() => dispatch('delete', comment)}
			>
				삭제
			</button>
		</div>
	</div>
	<p class="mt-2 text-gray-300 break-all">{comment.content}</p>
</div>
