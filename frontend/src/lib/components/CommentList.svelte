<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Comment, CommentCreateDto, CommentView } from '$lib/types';
	import { ApiClient } from '$lib/api/client';
	import { authStore } from '$lib/stores/auth';
	import { transformToCommentView } from '$lib/utils/comment';
	import CommentItem from './CommentItem.svelte';
	import CommentForm from './CommentForm.svelte';

	export let comments: Comment[] = [];
	export let postId: number;
	export let isLoading = false;

	let viewComments: CommentView[] = [];
	let replyingTo: CommentView | null = null;
	let showDeleteModal = false;
	let commentToDelete: CommentView | null = null;
	let deletePassword = '';
	let deleteError = '';

	const dispatch = createEventDispatcher<{
		commentUpdated: void;
	}>();

	$: viewComments = transformToCommentView(comments);

	async function handleCommentSubmit(event: CustomEvent<CommentCreateDto>) {
		try {
			await ApiClient.createComment(postId, event.detail);
			dispatch('commentUpdated');
		} catch (err) {
			console.error('댓글 작성 실패:', err);
			alert(err instanceof Error ? err.message : '댓글 작성 중 오류가 발생했습니다.');
		}
	}

	function handleReply(event: CustomEvent<CommentView>) {
		replyingTo = event.detail;
	}

	async function handleReplySubmit(event: CustomEvent<CommentCreateDto>) {
		if (replyingTo) {
			try {
				await ApiClient.createReply(postId, replyingTo.id, event.detail);
				dispatch('commentUpdated');
				replyingTo = null;
			} catch (err) {
				console.error('답글 작성 실패:', err);
				alert(err instanceof Error ? err.message : '답글 작성 중 오류가 발생했습니다.');
			}
		}
	}

	async function handleCommentDelete(event: CustomEvent<CommentView>) {
		if ($authStore) {
			try {
				const comment = event.detail;
				await ApiClient.adminDeleteComment(comment.id);
				dispatch('commentUpdated');
			} catch (err) {
				alert(err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다.');
			}
		} else {
			commentToDelete = event.detail;
			showDeleteModal = true;
		}
	}

	async function confirmDelete() {
		if (!commentToDelete || !deletePassword) return;

		try {
			await ApiClient.deleteComment(postId, commentToDelete.id, deletePassword);
			showDeleteModal = false;
			deletePassword = '';
			deleteError = '';
			dispatch('commentUpdated');
		} catch (err) {
			deleteError = err instanceof Error ? err.message : '댓글 삭제 중 오류가 발생했습니다.';
		}
	}

	function cancelDelete() {
		showDeleteModal = false;
		deletePassword = '';
		deleteError = '';
		commentToDelete = null;
	}
</script>

<div class="space-y-6">
	<CommentForm {isLoading} isReply={false} on:submit={handleCommentSubmit} />

	{#if viewComments.length > 0}
		<div class="space-y-4">
			{#each viewComments as comment (comment.id)}
				<div class="border border-gray-700 rounded-lg bg-gray-800/50 p-4">
					<CommentItem {comment} on:reply={handleReply} on:delete={handleCommentDelete} />

					{#if comment.replies.length > 0}
						<div class="mt-4 space-y-3">
							{#each comment.replies as reply (reply.id)}
								<CommentItem comment={reply} isReply={true} on:delete={handleCommentDelete} />
							{/each}
						</div>
					{/if}

					{#if replyingTo && replyingTo.id === comment.id}
						<div class="mt-4 ml-4 sm:ml-8">
							<CommentForm
								isReply={true}
								replyToName={replyingTo.nickname}
								{isLoading}
								on:submit={handleReplySubmit}
								on:cancel={() => (replyingTo = null)}
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<p class="text-center text-gray-400">첫 댓글을 작성해보세요!</p>
	{/if}
</div>

{#if showDeleteModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl">
			<h2 class="text-xl font-bold mb-4 text-white">댓글 삭제</h2>
			{#if deleteError}
				<p
					class="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm mb-4"
				>
					{deleteError}
				</p>
			{/if}
			<input
				type="password"
				bind:value={deletePassword}
				placeholder="비밀번호를 입력하세요"
				class="input-dark w-full mb-4"
			/>
			<div class="flex flex-col sm:flex-row gap-2 sm:justify-end">
				<button class="btn-secondary w-full sm:w-auto" on:click={cancelDelete}> 취소 </button>
				<button class="btn-danger w-full sm:w-auto" on:click={confirmDelete}> 삭제 </button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
  .input-dark {
    @apply px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600
           rounded-lg text-gray-200 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
           transition-all text-sm sm:text-base;
  }

	.btn-secondary {
		@apply px-4 py-2 bg-gray-700 text-gray-300
           rounded-lg font-semibold
           hover:bg-gray-600 hover:text-white
           focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800
           transition-all text-sm sm:text-base;
	}

	.btn-danger {
		@apply px-4 py-2 bg-gradient-to-r from-red-500 to-red-600
           text-white font-semibold rounded-lg
           hover:from-red-600 hover:to-red-700
           focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-all text-sm sm:text-base;
	}
</style>
