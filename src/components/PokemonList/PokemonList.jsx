import './pokemonList.css';
import Pokemon from '../pokemon/Pokemon';
import axios from "axios";
import { useEffect, useState } from "react";
function PokemonList(){

    const [pokemonList, setPokemonList] = useState([])
    const [isLoding, setIsLoding] = useState(true)
    const [pokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon?offset=20&limit=20');

    const [nextUrl, setNextUrl] = useState('');
    const [prevUrl, setPrevUrl] = useState('');

    async function downloadPokemons() {
        setIsLoding(true)
        const response = await axios.get(pokedexUrl); // this downloads list of 20 pokemons

        const pokemonResults = response.data.results; // we get the array of pokemons from result

        console.log(response.data);

        // iteratting over the array of pokemons, and using their url, to create an array of promises
        //that willl download those 20 pokemons
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);

        const pokemonResultPromise = pokemonResults.map((pokemon)=> axios.get(pokemon.url));
        const pokemonData = await axios.all(pokemonResultPromise);
        console.log(pokemonData);

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

        console.log(pokeListResult);
        setPokemonList(pokeListResult);
        setIsLoding(false)
    }

    useEffect(()=>{
        downloadPokemons();
    }, [pokedexUrl])

    return (
        <div className="pokemon-list-wrapper">
            <div>Pokemon List</div>
            <div className='pokemon-wrapper'>
                {(isLoding) ? 'Loding....' : 
                    pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />)
                }
            </div>
            <div className='control'>
                <button disabled={prevUrl == null} onClick={() => setPokedexUrl(prevUrl)}>prev</button>
                <button disabled={nextUrl == null} onClick={() => setPokedexUrl(nextUrl)}>next</button>
            </div>
        </div>
    )
}

export default PokemonList;