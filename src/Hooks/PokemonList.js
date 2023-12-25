
import { useEffect, useState } from "react";
import axios from "axios";

function usePokemonList() {

    const [pokemonListState, setpokemonListState ] = useState({
        pokemonList: [],
        isLoding: true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        nextUrl: '',
        prevUrl: '',
    });


    async function downloadPokemons() {

            setpokemonListState((state) => ({ ...state, isLoding: true}));
            const response = await axios.get(pokemonListState.pokedexUrl); // this downloads list of 20 pokemons

            const pokemonResults = response.data.results; // we get the array of pokemons from result

            console.log("response ise", response.data);
            console.log(pokemonListState);
            setpokemonListState((state) => ({
                ...state,
                nextUrl:response.data.next,
                prevUrl: response.data.previous
            }));



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
        }));
        
    }

    useEffect(()=>{
        downloadPokemons();
    }, [pokemonListState.pokedexUrl]);

    return [pokemonListState, setpokemonListState];

}

export default usePokemonList;