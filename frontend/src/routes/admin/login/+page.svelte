<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ApiClient } from '$lib/api/client';
	import { authStore } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { isTokenExpired } from '$lib/utils/jwt';
	import { base } from '$app/paths';

	let username = '';
	let password = '';
	let isLoading = false;
	let error = '';

	onMount(() => {
		if (browser && authStore.isAdmin()) {
			if (!isTokenExpired(localStorage.getItem('adminToken'))) {
				goto(`${base}/posts`);
			} else {
				authStore.clearToken();
			}
		}
	});

	async function handleSubmit() {
		if (!username.trim() || !password.trim()) {
			error = '모든 필드를 입력해주세요.';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await ApiClient.adminLogin({
				username,
				password
			});

			if (isTokenExpired(response.accessToken)) {
				throw new Error('Invalid token received');
			}

			authStore.setToken(response.accessToken);
			goto(`/posts`);
		} catch (err) {
			error = '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8"
>
	<div
		class="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl transform transition-all hover:scale-[1.01]"
	>
		<div>
			<h1 class="text-3xl font-extrabold text-center text-white mb-2">Admin Login</h1>
			<p class="text-center text-gray-400 text-sm">관리자 전용 로그인</p>
		</div>

		<form on:submit|preventDefault={handleSubmit} class="mt-8 space-y-6">
			{#if error}
				<div
					class="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm transition-all"
				>
					{error}
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-300 mb-2">
						Username
					</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						class="input"
						placeholder="관리자 아이디를 입력하세요"
						disabled={isLoading}
					/>
				</div>

				<div>
					<label for="adminPassword" class="block text-sm font-medium text-gray-300 mb-2">
						Password
					</label>
					<input
						id="adminPassword"
						type="password"
						bind:value={password}
						class="input"
						placeholder="관리자 비밀번호를 입력하세요"
						disabled={isLoading}
					/>
				</div>
			</div>

			<button
				type="submit"
				class="btn-primary w-full flex justify-center items-center h-12 relative overflow-hidden group"
				disabled={isLoading}
			>
				<span class="relative z-10 flex items-center justify-center w-full h-full">
					{#if isLoading}
						<svg
							class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					{/if}
					{isLoading ? '로그인 중...' : '로그인'}
				</span>
			</button>

			<p class="text-center text-sm text-gray-400 mt-4">
				일반 사용자는 로그인 없이 이용 가능합니다.
			</p>
		</form>
	</div>
</div>

<style lang="postcss">
	.input {
		@apply w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 
				 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
				 disabled:opacity-50 disabled:cursor-not-allowed transition-all;
	}

	.btn-primary {
		@apply rounded-lg text-white font-semibold
				 bg-gradient-to-r from-blue-500 to-indigo-600
				 hover:from-blue-600 hover:to-indigo-700
				 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
				 disabled:opacity-50 disabled:cursor-not-allowed
				 transform transition-all;
	}

	/* 반응형 애니메이션 */
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
