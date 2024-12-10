<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { CommentCreateDto } from '$lib/types';

	export let isReply = false;
	export let replyToName: string | undefined = undefined;
	export let isLoading = false;

	let content = '';
	let nickname = '';
	let password = '';
	let error = '';

	const dispatch = createEventDispatcher<{
		submit: CommentCreateDto;
		cancel: void;
	}>();

	function handleSubmit() {
		if (!content.trim() || !nickname.trim() || !password.trim()) {
			error = '모든 필드를 입력해주세요.';
			return;
		}

		error = '';
		dispatch('submit', {
			content: content.trim(),
			nickname: nickname.trim(),
			password: password.trim()
		});

		// 폼 초기화
		content = '';
		nickname = '';
		password = '';
	}
</script>

<div class="space-y-4">
	{#if isReply}
		<h3 class="text-lg font-semibold text-gray-200">
			답글 작성: {replyToName}님에게
		</h3>
	{:else}
		<h3 class="text-lg font-semibold text-gray-200">댓글 작성</h3>
	{/if}

	{#if error}
		<div class="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
			{error}
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div>
			<textarea
				bind:value={content}
				placeholder="댓글을 입력하세요"
				class="input-dark w-full h-24"
				disabled={isLoading}
			></textarea>
		</div>

		<div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
			<div class="flex-1 space-y-2 sm:space-y-0 sm:flex sm:gap-2">
				<input
					type="text"
					bind:value={nickname}
					placeholder="닉네임"
					class="input-dark w-full"
					disabled={isLoading}
				/>
				<input
					type="password"
					bind:value={password}
					placeholder="비밀번호"
					class="input-dark w-full"
					disabled={isLoading}
				/>
			</div>
			<div class="flex gap-2">
				<button type="submit" class="btn-primary flex-1 sm:flex-none" disabled={isLoading}>
					{isLoading ? '작성 중...' : '작성'}
				</button>
				{#if isReply}
					<button
						type="button"
						class="btn-secondary flex-1 sm:flex-none"
						on:click={() => dispatch('cancel')}
						disabled={isLoading}
					>
						취소
					</button>
				{/if}
			</div>
		</div>
	</form>
</div>

<style lang="postcss">
  .btn-primary {
    @apply px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600
           text-white font-semibold rounded-lg
           hover:from-blue-600 hover:to-indigo-700
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-all text-sm sm:text-base;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-700 text-gray-300
           rounded-lg font-semibold
           hover:bg-gray-600 hover:text-white
           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800
           transition-all text-sm sm:text-base;
  }

  .input-dark {
    @apply px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600
           rounded-lg text-gray-200 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
           transition-all text-sm sm:text-base;
  }
</style>