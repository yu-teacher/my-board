<script lang="ts">
	import { goto } from '$app/navigation';
	import { ApiClient } from '$lib/api/client';
	import { base } from '$app/paths';

	let title = '';
	let content = '';
	let nickname = '';
	let password = '';
	let isSubmitting = false;
	let error = '';

	async function handleSubmit() {
		if (!title.trim() || !content.trim() || !nickname.trim() || !password.trim()) {
			error = '모든 필드를 입력해주세요.';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			const response = await ApiClient.createPost({
				title,
				content,
				nickname,
				password
			});
			goto(`${base}/posts/${response.id}`);
		} catch (err) {
			error = err instanceof Error ? err.message : '게시글 작성 중 오류가 발생했습니다.';
			isSubmitting = false;
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 sm:p-4 lg:p-8">
	<div class="container mx-auto max-w-4xl">
		<h1 class="text-xl sm:text-2xl font-bold mb-6 text-white text-center">게시글 작성</h1>

		<div class="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6">
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				{#if error}
					<div
						class="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm"
					>
						{error}
					</div>
				{/if}

				<div>
					<label for="title" class="block text-sm font-medium text-gray-300 mb-2">제목</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						class="input-dark w-full"
						placeholder="제목을 입력하세요"
					/>
				</div>

				<div>
					<label for="content" class="block text-sm font-medium text-gray-300 mb-2">내용</label>
					<textarea
						id="content"
						bind:value={content}
						class="input-dark w-full h-48 sm:h-64"
						placeholder="내용을 입력하세요"
					></textarea>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="nickname" class="block text-sm font-medium text-gray-300 mb-2">닉네임</label
						>
						<input
							id="nickname"
							type="text"
							bind:value={nickname}
							class="input-dark w-full"
							placeholder="닉네임을 입력하세요"
						/>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-gray-300 mb-2"
							>비밀번호</label
						>
						<input
							id="password"
							type="password"
							bind:value={password}
							class="input-dark w-full"
							placeholder="비밀번호를 입력하세요"
						/>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
					<a href="{base}/posts" class="btn-secondary w-full sm:w-auto text-center">취소</a>
					<button type="submit" class="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
						{isSubmitting ? '작성 중...' : '작성하기'}
					</button>
				</div>
			</form>
		</div>
	</div>
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
		@apply px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-semibold
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
