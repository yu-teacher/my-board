<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let initialValue = '';
  export let placeholder = '검색어를 입력하세요';
  export let searchType = 'title';
  export let isLoading = false;
  export let isSearchMode = false;

  const dispatch = createEventDispatcher<{
    search: { value: string; type: string };
    reset: void;
  }>();

  let searchValue = initialValue;

  function handleSubmit() {
    dispatch('search', { value: searchValue, type: searchType });
  }

  function handleReset() {
    searchValue = '';
    dispatch('reset');
  }
</script>

<div class="flex flex-col gap-3">
  <div class="flex gap-2">
    <select bind:value={searchType} class="input-dark w-32 sm:w-36">
      <option value="title">제목</option>
      <option value="content">내용</option>
      <option value="nickname">작성자</option>
      <option value="all">모두</option>
    </select>
    <input
      type="text"
      bind:value={searchValue}
      {placeholder}
      class="input-dark flex-1"
      disabled={isLoading}
      on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
    />
  </div>
  <div class="flex gap-2">
    <button 
      class="btn-primary flex-1 sm:flex-none whitespace-nowrap" 
      on:click={handleSubmit}
      disabled={isLoading}
    >
      {isLoading ? '검색 중...' : '검색'}
    </button>
    {#if isSearchMode}
      <button 
        class="btn-secondary flex-1 sm:flex-none whitespace-nowrap"
        on:click={handleReset}
      >
        초기화
      </button>
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

  .btn-secondary {
    @apply px-3 sm:px-4 py-2 bg-gray-700 text-gray-300
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