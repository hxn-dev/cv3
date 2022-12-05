<script>
	import to from 'await-to-js';
	import toast from 'svelte-french-toast';
	import { Moon } from 'svelte-loading-spinners';
	import { createEventDispatcher } from 'svelte';

	import { SessionManager } from '$store/SessionManager';

	const dispatch = createEventDispatcher();
	let username = '',
		password = '',
		is_loading = false;

	const handleLogin = async () => {
		if (username.length <= 0 || password.length <= 0 || is_loading) {
			return;
		}
		is_loading = true;
		let error, data;
		[error, data] = await to(
			fetch('api/login', {
				method: 'POST',
				body: JSON.stringify({
					username: username.toLowerCase(),
					password
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		);

		if (error) {
			toast.error(data.error.faultString, { duration: 5000 });
			is_loading = false;
			return;
		}

		data = await data.json();
		if (!data.success) {
			toast.error(data.error.faultString, { duration: 5000 });
			is_loading = false;
			return;
		}
		if (data.success) {
			SessionManager.update((prev) => {
				prev.is_connected = true;
				prev.username = data.username;
				prev.token = data.token;
				return prev;
			});
			let records = data.data;
			is_loading = false;
			dispatch('loggedIn', {
				records
			});
		}
	};
</script>

<div class="max-w-sm mx-auto mt-8">
	<h2 class="text-2xl text-center">Chift Odoo Login</h2>
	<div class="form mt-4 px-4">
		<div class="mb-4 flex flex-col">
			<label for="username">Email</label>
			<input
				class="mt-1 px-4 border border-gray-400 rounded focus:outline-none focus:ring-0 focus:border-gray-700"
				bind:value={username}
				type="email"
				id="username"
			/>
		</div>
		<div class="mb-4 flex flex-col">
			<label for="password">Password</label>
			<input
				class="mt-1 px-4 border border-gray-400 rounded focus:outline-none focus:ring-0 focus:border-gray-700"
				bind:value={password}
				type="password"
				id="password"
			/>
		</div>
		<button
			class="w-full flex justify-center items-center mt-2 py-2 px-4 bg-red-main hover:bg-red-main-darker transition text-white uppercase font-semibold rounded"
			on:click={() => handleLogin()}
		>
			{#if is_loading}
				<Moon size="24" color="#FFF" />
			{:else}
				Login
			{/if}
		</button>
	</div>
</div>
