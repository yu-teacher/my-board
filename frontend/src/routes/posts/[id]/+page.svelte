<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import type { Post } from '$lib/types';
	import { ApiClient } from '$lib/api/client';
	import CommentList from '$lib/components/CommentList.svelte';
	import { base } from '$app/paths';

	export let data: { post: Post };
	let { post } = data;

	let showPasswordModal = false;
	let password = '';
	let isDeleting = false;
	let deleteError = '';
	let isSubmittingComment = false;

	async function handleDelete() {
		if (isDeleting) return;

		isDeleting = true;
		deleteError = '';

		try {
			if ($authStore) {
				await ApiClient.adminDeletePost(post.id);
			} else {
				await ApiClient.deletePost(post.id, password);
			}
			goto(`${base}/posts`); // preload 옵션 제거
		} catch (err) {
			deleteError = err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.';
		} finally {
			isDeleting = false;
		}
	}

	async function handleCommentUpdated() {
		try {
			const updatedPost = await ApiClient.getPost(post.id, fetch);
			post = updatedPost;
		} catch (err) {
			console.error('게시글 갱신 실패:', err);
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 sm:p-4 lg:p-8">
	<div class="container mx-auto max-w-4xl">
		<div class="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 mb-6">
			<div class="flex flex-col sm:flex-row justify-between gap-4">
				<div class="w-full">
					<button
						class="btn-secondary mb-4 w-full sm:w-auto text-sm"
						on:click={() => goto(`${base}/posts`)}
					>
						← 목록으로
					</button>
					<h1 class="text-xl sm:text-3xl font-bold text-white break-all">{post.title}</h1>
				</div>
				<div class="flex gap-2 w-full sm:w-auto">
					<a
						href="{base}/posts/{post.id}/edit"
						data-sveltekit-preload
						class="btn-secondary flex-1 sm:flex-none text-center"
					>
						수정
					</a>
					{#if $authStore}
						<button class="btn-danger flex-1 sm:flex-none" on:click={handleDelete}>삭제</button>
					{:else}
						<button
							class="btn-danger flex-1 sm:flex-none"
							on:click={() => (showPasswordModal = true)}
						>
							삭제
						</button>
					{/if}
				</div>
			</div>

			<div class="text-gray-400 mt-4 text-sm sm:text-base flex flex-wrap gap-2">
				<span>{post.nickname}</span>
				<span class="hidden sm:inline">•</span>
				<span>조회 {post.viewCount}</span>
				<span class="hidden sm:inline">•</span>
				<span>{new Date(post.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</span>
			</div>
		</div>

		<div class="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 mb-6">
			<div class="text-gray-300 whitespace-pre-wrap break-all">
				{post.content}
			</div>
		</div>

		<div class="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6">
			<CommentList
				comments={post.comments || []}
				postId={post.id}
				isLoading={isSubmittingComment}
				on:commentUpdated={handleCommentUpdated}
			/>
		</div>
	</div>
</div>

<!-- 비밀번호 확인 모달 -->
{#if showPasswordModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
			<h2 class="text-xl font-bold mb-4 text-white">비밀번호 확인</h2>
			{#if deleteError}
				<p
					class="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm mb-4"
				>
					{deleteError}
				</p>
			{/if}
			<input
				type="password"
				bind:value={password}
				placeholder="비밀번호를 입력하세요"
				class="input-dark w-full mb-4"
			/>
			<div class="flex flex-col sm:flex-row justify-end gap-2">
				<button
					class="btn-secondary w-full sm:w-auto"
					on:click={() => {
						showPasswordModal = false;
						password = '';
						deleteError = '';
					}}
				>
					취소
				</button>
				<button class="btn-danger w-full sm:w-auto" disabled={isDeleting} on:click={handleDelete}>
					{isDeleting ? '삭제 중...' : '삭제'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
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

  .input-dark {
    @apply px-3 sm:px-4 py-2 bg-gray-700 border border-gray-600
           rounded-lg text-gray-200 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
           transition-all text-sm sm:text-base;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  div {
    animation: fadeIn 0.5s ease-out;
  }
</style>
