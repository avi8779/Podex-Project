import './pokemonList.css';
import Pokemon from '../pokemon/Pokemon';
import axios from "axios";
import { useEffect, useState } from "react";
function PokemonList(){


    const [pokemonListState, setpokemonListState ] = useState({
        pokemonList: [],
        isLoding: true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        nextUrl: '',
        prevUrl: '',
    })

    async function downloadPokemons() {

        setpokemonListState((state) => ({ ...state, isLoding: true}));
        const response = await axios.get(pokemonListState.pokedexUrl); // this downloads list of 20 pokemons

        const pokemonResults = response.data.results; // we get the array of pokemons from result


        setpokemonListState((state) => ({
            ...state,
            nextUrl:response.data.next,
            prevUrl: response.data.previous
        }))

        // iteratting over the array of pokemons, and using their url, to create an array of promises
        //that willl download those 20 pokemons

        const pokemonResultPromise = pokemonResults.map((pokemon)=> axios.get(pokemon.url));
        const pokemonData = await axios.all(pokemonResultPromise);
        

        // now iterate on the data of each pokemon, and extract id, name, image, types 
        const  pokeListResult = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types
            }
        });

        setpokemonListState((state)=>({
            ...state,
            pokemonList: pokeListResult,
            isLoding: false
        }))
        
    }

    useEffect(()=>{
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]);

    return (
        <div className="pokemon-list-wrapper">
            <div>Pokemon List</div>
            <div className='pokemon-wrapper'>
                {(pokemonListState.isLoding) ? 'Loding....' : 
                    pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
                }
            </div>
            <div className='control'>
                <button disabled={pokemonListState.prevUrl == null} onClick={() => {
                    const urlToSet = pokemonListState.prevUrl;
                    setpokemonListState({ ...pokemonListState, pokedexUrl: urlToSet})
                }
                }>prev</button>
                <button disabled={pokemonListState.nextUrl == null} onClick={() => {
                    const urlToSet = pokemonListState.nextUrl;
                    setpokemonListState({ ...pokemonListState, pokedexUrl: urlToSet})
                }
                }>next</button>
            </div>
        </div>
    )
}

export default PokemonList;