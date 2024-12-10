<script lang="ts">
	export let currentPage: number;
	export let totalPages: number;
	export let onPageChange: (page: number) => void;

	$: startPage = Math.max(0, currentPage - 2);
	$: endPage = Math.min(totalPages - 1, currentPage + 2);

	$: pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

	function goToPage(page: number) {
		if (page >= 0 && page < totalPages) {
			onPageChange(page);
		}
	}
</script>

<div class="flex items-center justify-center gap-1 sm:gap-2">
	{#if startPage > 0}
		<button class="pagination-btn text-sm sm:text-base" on:click={() => goToPage(0)}> 1 </button>
		{#if startPage > 1}
			<span class="px-1 sm:px-2 text-gray-400">...</span>
		{/if}
	{/if}

	{#each pages as page}
		<button
			class="pagination-btn text-sm sm:text-base {currentPage === page ? 'active' : ''}"
			on:click={() => goToPage(page)}
		>
			{page + 1}
		</button>
	{/each}

	{#if endPage < totalPages - 1}
		{#if endPage < totalPages - 2}
			<span class="px-1 sm:px-2 text-gray-400">...</span>
		{/if}
		<button class="pagination-btn text-sm sm:text-base" on:click={() => goToPage(totalPages - 1)}>
			{totalPages}
		</button>
	{/if}
</div>

<style lang="postcss">
	.pagination-btn {
		@apply min-w-[2rem] sm:min-w-[2.5rem] px-2 sm:px-3 py-1 sm:py-2 
						 rounded-lg border border-gray-600 
						 bg-gray-700 text-gray-300
						 hover:bg-gray-600 hover:text-white 
						 transition-colors;
	}

	.pagination-btn.active {
		@apply bg-gradient-to-r from-blue-500 to-indigo-600
						 text-white border-transparent
						 hover:from-blue-600 hover:to-indigo-700
						 transform scale-105;
	}
</style>
