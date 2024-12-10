<script lang="ts">
	import type { Page, Post } from '$lib/types';
	import { ApiClient } from '$lib/api/client';
	import { authStore } from '$lib/stores/auth';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let posts: Page<Post>;
	let currentPage = 0;
	let isLoading = false;
	let searchKeyword = '';
	let searchType = 'title';
	let isSearchMode = false;

	async function loadPosts(page = 0) {
		isLoading = true;
		try {
			if (isSearchMode && searchKeyword.trim()) {
				posts = await ApiClient.searchPosts(searchKeyword, searchType, page, 10);
			} else {
				posts = await ApiClient.getPosts(page, 10, 'createdAt', 'DESC');
			}
			currentPage = page;
		} catch (err) {
			console.error('Failed to load posts:', err);
		} finally {
			isLoading = false;
		}
	}

	async function handleSearch() {
		if (!searchKeyword.trim()) {
			isSearchMode = false;
			return loadPosts(0);
		}

		isSearchMode = true;
		isLoading = true;
		try {
			posts = await ApiClient.searchPosts(searchKeyword, searchType, 0, 10);
			currentPage = 0;
		} catch (err) {
			console.error('Failed to search posts:', err);
		} finally {
			isLoading = false;
		}
	}

	function resetSearch() {
		searchKeyword = '';
		searchType = 'title';
		isSearchMode = false;
		loadPosts(0);
	}

	onMount(() => {
		loadPosts();
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-2 sm:p-4 lg:p-8">
	<div class="container mx-auto max-w-6xl">
		<!-- 헤더 -->
		<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
			<h1 class="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
				게시글 목록
			</h1>
			<div class="w-full sm:w-auto">
				<a
					href="{base}/posts/write"
					data-sveltekit-prefetch
					class="btn-primary w-full sm:w-auto flex justify-center transform hover:scale-105 transition-all"
				>
					글쓰기
				</a>
			</div>
		</div>

		<!-- 검색바 -->
		<div class="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 mb-6">
			<SearchBar
				initialValue={searchKeyword}
				{isLoading}
				{isSearchMode}
				{searchType}
				on:search={({ detail }) => {
					searchKeyword = detail.value;
					searchType = detail.type;
					handleSearch();
				}}
				on:reset={resetSearch}
			/>
		</div>

		<!-- 게시글 목록 -->
		{#if isLoading}
			<div class="flex justify-center py-8 sm:py-12">
				<div
					class="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"
				></div>
			</div>
		{:else if posts?.content?.length}
			<div class="space-y-3 sm:space-y-4">
				{#each posts.content as post}
					<div
						class="bg-gray-800 border border-gray-700 p-4 sm:p-5 rounded-xl hover:bg-gray-700/50 transition-all transform hover:scale-[1.01] cursor-pointer"
					>
						<a href="{base}/posts/{post.id}" class="block">
							<h2 class="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2">
								{post.title}
							</h2>
							<div class="text-gray-400 text-xs sm:text-sm flex flex-wrap gap-2 sm:gap-3">
								<span>{post.nickname}</span>
								<span class="hidden sm:inline">•</span>
								<span>조회 {post.viewCount}</span>
								<span class="hidden sm:inline">•</span>
								<span>{new Date(post.createdAt).toLocaleString()}</span>
							</div>
						</a>
					</div>
				{/each}
			</div>

			<div class="mt-6 sm:mt-8">
				<Pagination {currentPage} totalPages={posts.totalPages} onPageChange={loadPosts} />
			</div>
		{:else}
			<div class="text-center py-8 sm:py-12 text-gray-400">게시글이 없습니다.</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.btn-primary {
		@apply px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600
					 text-white font-semibold rounded-lg
					 hover:from-blue-600 hover:to-indigo-700
					 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
					 disabled:opacity-50 disabled:cursor-not-allowed
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