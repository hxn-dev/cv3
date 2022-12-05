<script>
	import to from 'await-to-js';
	import toast from 'svelte-french-toast';
	import { scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { Moon } from 'svelte-loading-spinners';
	import { SessionManager } from '$store/SessionManager';

	const dispatch = createEventDispatcher();
	export let id, email, name, street, country_id;
	let is_loading = false;

	if (email === false) email = ''
	if (street === false) street = ''
	if (name === false) name = ''

	const handleCancel = () => {
		dispatch('close');
	};

	const handleEdit = async () => {
		is_loading = true;
		let username = $SessionManager.username;
		let token = $SessionManager.token;
		let error, data;
		[error, data] = await to(
			fetch('api/contact', {
				method: 'POST',
				body: JSON.stringify({
					username,
					token,
					data: { id, email, name, street, country_id },
					action: 'edit'
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		);

		if (error) {
			console.log('error: ', error);
			is_loading = false;
			return;
		}
		data = await data.json();
		if (!data.success) {
			toast.error(`Error:  ${data.error.faultString}`, { duration: 5000 });
			is_loading = false;
			return;
		}
		if (data.success) {
			toast.success(`Account edited successfully`, { duration: 5000 });
			is_loading = false;
			dispatch('accountEdited', data.edited_account);
		}
	};

	const countries = [
		{ id: 0, name: 'None' },
		{ id: 20, name: 'Belgium' },
		{ id: 75, name: 'France' },
		{ id: 233, name: 'United State' }
	];
</script>

<div class="overlay">
	<div
		class="max-w-md mx-auto py-8 mt-12 bg-white shadow-sm w-full h-auto rounded-lg border z-40 overflow-y-auto"
		in:scale
	>
		<h2 class="mt-2 text-2xl text-center text-red-main">Create a contact</h2>
		<div class="form mt-4 px-4">
			<div class="mb-4 flex flex-col">
				<label class="ml-1" for="email">Email</label>
				<input
					bind:value={email}
					class="mt-1 px-4 border border-gray-400 rounded focus:outline-none focus:ring-0 focus:border-gray-700"
					type="text"
					id="email"
				/>
			</div>
			<div class="mb-4 flex flex-col">
				<label class="ml-1" for="name">Name</label>
				<input
					bind:value={name}
					class="mt-1 px-4 border border-gray-400 rounded focus:outline-none focus:ring-0 focus:border-gray-700"
					type="text"
					id="name"
				/>
			</div>
			<div class="mb-4 flex flex-col">
				<label class="ml-1" for="street">Street</label>
				<input
					bind:value={street}
					class="mt-1 px-4 border border-gray-400 rounded focus:outline-none focus:ring-0 focus:border-gray-700"
					type="text"
					id="street"
				/>
			</div>
			<div class="mb-4 flex flex-col">
				<label class="ml-1" for="country">Country</label>
				<select name="country" id="country" bind:value={country_id}>
					{#each countries as country}
						<option value={country.id}>{country.name}</option>
					{/each}
				</select>
			</div>
			<div class="mt-6 flex gap-x-4">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="w-full py-1 flex justify-center bg-red-main text-white rounded cursor-pointer hover:bg-red-main-darker transition"
					on:click={() => handleEdit()}
				>
					{#if is_loading}
						<Moon size="20" color="#FFF" />
					{:else}
						Edit
					{/if}
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="w-full py-1 text-center bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition"
					on:click={() => handleCancel()}
				>
					Cancel
				</div>
			</div>
		</div>
	</div>
</div>
