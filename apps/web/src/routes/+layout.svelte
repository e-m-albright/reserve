<script lang="ts">
import '../app.css';

const { children } = $props();
</script>

<svelte:head>
	<title>Reserve</title>
	<meta name="description" content="Ethical booking assistant" />
</svelte:head>

{@render children()}
