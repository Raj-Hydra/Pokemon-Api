const pokemonList = document.getElementById('pokemonList');
        const loadMoreButton = document.getElementById('loadMoreButton');
        const searchInput = document.getElementById('searchInput');
        let offset = 0;

        async function getPokemons(limit, offset) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await response.json();
            return data.results;
        }

        function createPokemonElement(pokemon) {
            return `
                <li class="pokemon ${pokemon.type}">
                    <span class="numero-pokemon">#${pokemon.number}</span>
                    <span class="nome">${pokemon.name}</span>
                    <div class="detalhe">
                        <ol class="tipos">
                            ${pokemon.types.map(type => `<li class="tipo ${type}">${type}</li>`).join('')}
                        </ol>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2bIAfuVDXvpoMCL8sTbdmagS6SIQmkf6TYA&usqp=CAU" alt="${pokemon.name}">
                    </div>
                </li>`;
        }

        async function loadPokemonItems(limit, offset) {
            const pokemons = await getPokemons(limit, offset);
            pokemons.forEach(async (pokemon) => {
                const response = await fetch(pokemon.url);
                const data = await response.json();
                const pokemonInfo = {
                    number: data.id,
                    name: data.name,
                    types: data.types.map(typeSlot => typeSlot.type.name),
                    type: data.types[0].type.name,
                    photo: data.sprites.other.dream_world.front_default
                };
                pokemonList.innerHTML += createPokemonElement(pokemonInfo);
            });
        }

        loadPokemonItems(9, 0);

        loadMoreButton.addEventListener('click', () => {
            offset += 9;
            loadPokemonItems(9, offset);
        });

        // Add event listener for search input
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const pokemonItems = document.querySelectorAll('.pokemon');
            pokemonItems.forEach(pokemonItem => {
                const pokemonName = pokemonItem.querySelector('.nome').textContent.toLowerCase();
                if (pokemonName.includes(searchTerm)) {
                    pokemonItem.style.display = 'block';
                } else {
                    pokemonItem.style.display = 'none';
                }
            });
        });