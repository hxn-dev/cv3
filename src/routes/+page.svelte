<script>
	import to from 'await-to-js';
	import toast from 'svelte-french-toast';
	import { Moon } from 'svelte-loading-spinners';
	import { SessionManager } from '$store/SessionManager';
	import LoginComponent from '$lib/components/LoginComponent.svelte';
	import CreateContactComponent from '$lib/components/CreateContactComponent.svelte';
	import EditContactComponent from '$lib/components/EditContactComponent.svelte';

	$: is_connected = $SessionManager.is_connected;
	$: state = '';
	$: records = [];
	let id, email, name, street, country_id;
	let is_loading = false;

	SessionManager.subscribe((store) => {
		if (!store) return;
		is_connected = store.is_connected;
	});

	const getFlagsByName = (name) => {
		if (name.includes('Belgium'))
			return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><g clip-path="url(#a)"><path fill="#ED4C5C" d="M23.25 12c0-4.912-3.113-9.075-7.5-10.612v21.224c4.387-1.537 7.5-5.7 7.5-10.612Z"/><path fill="#3E4347" d="M.75 12c0 4.913 3.15 9.075 7.5 10.613V1.387C3.9 2.925.75 7.088.75 12Z"/><path fill="#FFE62E" d="M15.75 1.387A11.248 11.248 0 0 0 12 .75c-1.313 0-2.588.225-3.75.637v21.226c1.162.412 2.438.637 3.75.637 1.313 0 2.588-.225 3.75-.637V1.387Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>`;
		else if (name.includes('United'))
			return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><g clip-path="url(#a)"><path fill="#ED4C5C" d="M18 2.475C16.238 1.387 14.213.75 12 .75v1.725h6Z"/><path fill="#fff" d="M12 4.2h8.1A13.178 13.178 0 0 0 18 2.475h-6V4.2Z"/><path fill="#ED4C5C" d="M12 5.925h9.488c-.413-.637-.863-1.2-1.35-1.725H12v1.725Z"/><path fill="#fff" d="M12 7.65h10.387c-.262-.6-.562-1.2-.9-1.725H12V7.65Z"/><path fill="#ED4C5C" d="M12 9.375h10.95c-.15-.6-.337-1.163-.563-1.725H12v1.725Z"/><path fill="#fff" d="M12 11.137h11.212c-.037-.6-.15-1.162-.262-1.724H12v1.724Z"/><path fill="#ED4C5C" d="M23.212 11.137H12V12H.75c0 .3 0 .563.037.863h22.425c.038-.3.038-.563.038-.863 0-.3 0-.6-.038-.863Z"/><path fill="#fff" d="M1.05 14.588h21.9c.15-.563.225-1.125.262-1.725H.787c.038.562.113 1.162.263 1.725Z"/><path fill="#ED4C5C" d="M1.612 16.313h20.775c.226-.563.413-1.125.563-1.725H1.05c.15.6.337 1.162.562 1.725Z"/><path fill="#fff" d="M2.512 18.038h18.976c.337-.563.637-1.125.9-1.726H1.611c.263.6.563 1.163.9 1.726Z"/><path fill="#ED4C5C" d="M3.863 19.762h16.274c.488-.524.976-1.125 1.35-1.724H2.514c.375.637.862 1.2 1.35 1.724Z"/><path fill="#fff" d="M5.962 21.488h12.076c.787-.488 1.462-1.088 2.1-1.726H3.861c.638.675 1.35 1.238 2.1 1.726Z"/><path fill="#ED4C5C" d="M12 23.25c2.213 0 4.275-.637 6.038-1.762H5.963A11.157 11.157 0 0 0 12 23.25Z"/><path fill="#428BC1" d="M6 2.475c-.787.487-1.5 1.087-2.138 1.725a9.761 9.761 0 0 0-1.35 1.725c-.337.563-.675 1.125-.9 1.725a13.247 13.247 0 0 0-.562 1.725A8.705 8.705 0 0 0 .787 11.1c-.037.3-.037.6-.037.9H12V.75c-2.213 0-4.237.637-6 1.725Z"/><path fill="#fff" d="m9.375 1.125.188.563h.562l-.45.375.15.562-.45-.337-.45.337.15-.563-.45-.374h.563l.187-.563Zm1.5 2.25.188.563h.562l-.45.374.15.563-.45-.338-.45.338.15-.563-.45-.375h.563l.187-.562Zm-3 0 .188.563h.562l-.45.374.15.563-.45-.338-.45.338.15-.563-.45-.375h.563l.187-.562Zm1.5 2.25.188.563h.562l-.45.375.15.562-.45-.338-.45.338.15-.563-.45-.375h.563l.187-.562Zm-3 0 .188.563h.562l-.45.375.15.562-.45-.338-.45.338.15-.563-.45-.375h.563l.187-.562Zm-3 0 .188.563h.562l-.45.375.15.562-.45-.338-.45.338.15-.563-.45-.375h.563l.187-.562Zm7.5 2.25.188.563h.562l-.45.374.15.563-.45-.338-.45.338.15-.563-.45-.374h.563l.187-.563Zm-3 0 .188.563h.562l-.45.374.15.563-.45-.338-.45.338.15-.563-.45-.374h.563l.187-.563Zm-3 0 .188.563h.562l-.45.374.15.563-.45-.338-.45.338.15-.563-.45-.374h.563l.187-.563Zm4.5 2.25.188.563h.562l-.45.374.15.563-.45-.338-.45.338.15-.563-.45-.374h.563l.187-.563Zm-3 0 .188.563h.562l-.45.374.15.563-.45-.338-.45.338.15-.563-.45-.374h.563l.187-.563Zm-3 0 .188.563h.562l-.45.374.15.563-.45-.338-.45.338.15-.563-.45-.374h.563l.187-.563Zm1.05-5.25.45-.338.45.338-.187-.563.45-.375h-.563l-.15-.562-.187.563h-.525l.45.337-.188.6Zm-3 4.5.45-.338.45.338-.187-.563.45-.374h-.525l-.188-.563-.187.563h-.375c0 .037-.038.074-.038.112l.3.225-.15.6Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>`;
		else if (name.includes('France'))
			return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><g clip-path="url(#a)"><path fill="#428BC1" d="M.712 12c0 4.913 3.15 9.075 7.5 10.613V1.387C3.862 2.925.712 7.087.712 12Z"/><path fill="#ED4C5C" d="M23.212 12c0-4.912-3.112-9.075-7.5-10.613v21.226c4.388-1.538 7.5-5.7 7.5-10.613Z"/><path fill="#fff" d="M8.212 22.613c1.163.412 2.438.637 3.75.637 1.313 0 2.588-.225 3.75-.637V1.387a11.086 11.086 0 0 0-3.75-.637c-1.35 0-2.587.225-3.75.637v21.226Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></svg>`;
		else return '';
	};

	let currentPage = 0;
	let accountsPerPage = 6;

	const getPagesCount = () => Math.ceil(records.length / accountsPerPage);

	const setCurrentPage = (value) => {
		if (value > getPagesCount() - 1) {
			currentPage = getPagesCount() - 1;
			return;
		}
		if (currentPage == 0 && value < 0) {
			currentPage = 0;
			return;
		}
		currentPage = value;
	};

	$: getRecordsFromOffset = () => {
		const offset = currentPage * accountsPerPage;
		return records.slice(offset, offset + accountsPerPage);
	};

	const handleAddContact = () => (state = 'create');

	const addAccount = (data) => {
		records.unshift({
			...data,
			avatar_128:
				'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'
		});
		// Unshift doesn't re-render
		records = records;
		state = '';
	};

	const handleEditAccount = ({ edit_id, edit_email, edit_name, edit_street, edit_country_id }) => {
		id = edit_id;
		email = edit_email;
		name = edit_name;
		street = edit_street;
		country_id =
			edit_country_id == null ? countries.filter((country) => country.id == 0) : edit_country_id[0];

		state = 'edit';
	};

	const countries = [
		{ id: 0, name: 'None' },
		{ id: 20, name: 'Belgium' },
		{ id: 75, name: 'France' },
		{ id: 233, name: 'United State' }
	];

	const handleEditedAccount = (data) => {
		const editedAccountIndex = records.findIndex((record) => data.id == record.id);
		records[editedAccountIndex].email = data.email;
		records[editedAccountIndex].name = data.name;
		records[editedAccountIndex].street = data.street;
		const country =
			data.country_id == null
				? null
				: countries.filter((country) => country.id == data.country_id)[0];
		records[editedAccountIndex].country_id = country == null ? false : [country.id, country.name];
		state = '';
	};

	const deleteAccount = async (id) => {
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
					data: { id },
					action: 'delete'
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		);
		document.activeElement.blur();
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

		toast.success(`Account deleted successfully`, { duration: 5000 });
		is_loading = false;
		records = records.filter((record) => record.id != id);
	};
</script>

{#if !is_connected}
	<LoginComponent on:loggedIn={(data) => (records = data.detail.records)} />
{/if}

{#if is_connected}
	{#if state == 'create'}
		<CreateContactComponent
			on:accountCreated={(data) => addAccount(data.detail)}
			on:close={() => (state = '')}
		/>
	{:else if state == 'edit'}
		<EditContactComponent
			{id}
			{email}
			{name}
			{street}
			{country_id}
			on:accountEdited={(data) => handleEditedAccount(data.detail)}
			on:close={() => (state = '')}
		/>
	{/if}
	<div class="container mx-auto pt-8">
		<h1 class="my-4 mb-8 text-4xl text-center">Chift accounts V3</h1>
		<div class="pagination flex items-center justify-center gap-x-2">
			<button
				class="py-1 px-4 bg-white text-grey font-semibold rounded-lg shadow-sm {currentPage <= 0
					? 'bg-gray-200 text-gray-400 cursor-default'
					: ''}"
				on:click={() => {
					setCurrentPage(currentPage - 1);
				}}>Previous</button
			>
			<div class="hidden md:flex gap-x-2">
				{#each Array(getPagesCount()) as _, i}
					<button
						class="py-1 px-4 bg-white text-grey font-semibold rounded-lg shadow-sm {currentPage == i
							? 'bg-gray-200 text-gray-400 cursor-default'
							: ''}"
						on:click={() => {
							setCurrentPage(i);
						}}>{i + 1}</button
					>
				{/each}
			</div>
			<button
				class="py-1 px-4 bg-white text-grey font-semibold rounded-lg shadow-sm {currentPage >=
				getPagesCount() - 1
					? 'bg-gray-200 text-gray-400 cursor-default'
					: ''}"
				on:click={() => {
					setCurrentPage(currentPage + 1);
				}}>Next</button
			>
		</div>
		<div class="mt-6 flex items-center justify-center">
			<button
				class="py-2 px-4 bg-red-main text-white rounded uppercase font-semibold hover:bg-red-main-darker transition"
				on:click={() => handleAddContact()}>Add Contact</button
			>
		</div>
		<div
			class="accounts-container mt-12 gap-y-16 gap-x-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
		>
			{#each getRecordsFromOffset() as row}
				<div class="account flex flex-col items-center justify-start relative text-center">
					<div class="account__logo absolute top-[-30px]">
						{#if atob(row.avatar_128).includes('<?xml')}
							<img
								class="rounded-full w-16 h-16 shadow-md"
								src="data:image/svg+xml;base64,{row?.avatar_128}"
								alt="Avatar"
							/>
						{:else}
							<img
								class="rounded-full w-16 h-16 bg-white shadow-md"
								src="data:image/png;base64,{row?.avatar_128}"
								alt="Avatar"
							/>
						{/if}
					</div>
					<div
						class="account__name shadow-sm pt-12 pb-4 bg-white text-red-main font-bold uppercase w-full max-w-[325px] lg:max-w-[425px] border-t-4 border-red-main rounded-lg"
					>
						{row.name}
					</div>
					{#if row?.country_id}
						<div
							class="account__country py-2 mt-2 text-grey font-semibold shadow-sm bg-white uppercase w-full max-w-[325px] lg:max-w-[425px] rounded-lg relative"
						>
							<span class="flag absolute left-[12px]"
								>{@html getFlagsByName(row?.country_id[1])}</span
							>
							{#if row?.zip}
								{row?.zip}
							{/if}
							{row?.country_id[1]}
						</div>
					{/if}
					{#if row?.street}
						<div
							class="account__address py-2 mt-2 text-grey font-semibold shadow-sm bg-white uppercase w-full max-w-[325px] lg:max-w-[425px] rounded-lg relative"
						>
							<span class="flag absolute top-[11px] left-[12px]"
								><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
									><path
										fill="#BBB"
										fill-rule="evenodd"
										d="M8.784 15.681 9 15.375l-.216.306Zm.432 0h.002l.003-.003.011-.009.045-.032.161-.121a16.27 16.27 0 0 0 2.283-2.164c1.24-1.434 2.529-3.482 2.529-5.824a5.294 5.294 0 0 0-1.537-3.73A5.237 5.237 0 0 0 6.99 2.652a5.235 5.235 0 0 0-1.702 1.144A5.294 5.294 0 0 0 3.75 7.529c0 2.34 1.288 4.389 2.529 5.823a16.271 16.271 0 0 0 2.283 2.164l.205.154.012.008.004.003h.001c.13.092.303.092.432 0ZM9 15.375l.216.306L9 15.375ZM10.875 7.5a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Z"
										clip-rule="evenodd"
									/></svg
								></span
							>
							{row?.street}
						</div>
					{/if}
					{#if row?.email}
						<div
							class="account__email py-2 mt-2 text-grey font-semibold shadow-sm bg-white w-full max-w-[325px] lg:max-w-[425px] rounded-lg relative"
						>
							<span class="flag absolute top-[11px] left-[12px]"
								><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
									><path
										fill="#BBB"
										d="M9 16.5a7.253 7.253 0 0 1-2.906-.591 7.594 7.594 0 0 1-2.39-1.613 7.593 7.593 0 0 1-1.613-2.39A7.253 7.253 0 0 1 1.5 9c0-1.037.197-2.01.591-2.915.393-.907.931-1.7 1.612-2.381a7.605 7.605 0 0 1 2.39-1.614A7.26 7.26 0 0 1 9 1.5c1.037 0 2.01.197 2.915.59a7.623 7.623 0 0 1 3.994 3.994A7.23 7.23 0 0 1 16.5 9v1.088c0 .737-.253 1.365-.759 1.884a2.506 2.506 0 0 1-1.866.778c-.45 0-.869-.1-1.256-.3a2.815 2.815 0 0 1-.957-.787A3.728 3.728 0 0 1 9 12.75a3.613 3.613 0 0 1-2.653-1.097C5.616 10.922 5.25 10.037 5.25 9s.366-1.922 1.097-2.654C7.078 5.617 7.962 5.25 9 5.25c1.037 0 1.922.365 2.653 1.096A3.616 3.616 0 0 1 12.75 9v1.088c0 .362.113.646.338.852.225.207.487.31.787.31.3 0 .563-.103.787-.31.225-.206.338-.49.338-.852V9c0-1.638-.59-3.047-1.772-4.229C12.047 3.591 10.638 3 9 3s-3.047.59-4.229 1.771C3.591 5.954 3 7.362 3 9c0 1.637.59 3.047 1.771 4.228C5.954 14.409 7.362 15 9 15h3.75v1.5H9Zm0-5.25a2.17 2.17 0 0 0 1.594-.656A2.17 2.17 0 0 0 11.25 9a2.17 2.17 0 0 0-.656-1.594A2.17 2.17 0 0 0 9 6.75a2.17 2.17 0 0 0-1.594.656A2.17 2.17 0 0 0 6.75 9c0 .625.219 1.156.656 1.594A2.17 2.17 0 0 0 9 11.25Z"
									/></svg
								></span
							>
							{row?.email}
						</div>
					{/if}
					<div
						class="account__actions mt-2 text-grey font-semibold shadow-sm bg-white w-full max-w-[325px] lg:max-w-[425px] rounded-lg relative border-b-4 border-red-main"
					>
						<div class="flex">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								on:click={() =>
									handleEditAccount({
										edit_id: row.id,
										edit_email: row?.email,
										edit_name: row?.name,
										edit_street: row?.street,
										edit_country_id: row.country_id
									})}
								class="w-1/2 py-2 text-center uppercase text-orange-500 cursor-pointer hover:bg-orange-500 hover:text-white transition"
							>
								Edit
							</div>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								on:click={() => deleteAccount(row?.id)}
								class="w-1/2 py-2 flex justify-center uppercase text-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition"
							>
								{#if is_loading}
									<Moon size="20" color="#752121" />
								{:else}
									Delete
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
