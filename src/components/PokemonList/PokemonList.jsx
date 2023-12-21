import './pokemonList.css';
import Pokemon from '../pokemon/Pokemon';
import axios from "axios";
import { useEffect, useState } from "react";
function PokemonList(){

    const [pokemonList, setPokemonList] = useState([])
    const [isLoding, setIsLoding] = useState(true)
    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20'

    async function downloadPokemons() {
        const response = await axios.get(POKEDEX_URL);

        const pokemonResults = response.data.results;
        const pokemonResultPromise = pokemonResults.map((pokemon)=> axios.get(pokemon.url));
        const pokemonData = await axios.all(pokemonResultPromise);
        console.log(pokemonData);
        const  pokeListResult = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;
            return {
                id: pokemon.id,
                name: pokemon.name,
                image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                types: pokemon.types
            }
        });

        console.log(pokeListResult);
        setPokemonList(pokeListResult);
        setIsLoding(false)
    }

    useEffect(()=>{
        downloadPokemons();
    }, [])

    return (
        <div className="pokemon-list-wrapper">
            <div>Pokemon List</div>
            {(isLoding) ? 'Loding....' : 
                pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
            }
        
        </div>
    )
}

export default PokemonList;