import './pokemonList.css';
import Pokemon from '../pokemon/Pokemon';
import usePokemonList from '../../Hooks/usePokemonList';

function PokemonList(){

    const [ pokemonListState, setpokemonListState ] = usePokemonList( false);

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