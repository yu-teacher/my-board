<script>
  import "../app.css";
  import { onMount } from 'svelte';
  import { suppressFetchWarnings } from '$lib/utils/console';

  onMount(() => {
    suppressFetchWarnings();
  });
</script>

<slot />