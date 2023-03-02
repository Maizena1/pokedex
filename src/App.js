import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Card } from './components/card/Card'
import { Modal } from './components/modal/Modal';


function usePokemonType(){
  const [types, setTypes]=useState([]);

  useEffect(() => {
    const fetchPokemonTypes = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/type')
      const data = await response.json();

      const temporalTypes = [];

      for(const type of data.results){
        temporalTypes.push(type.name);
      }
      setTypes(temporalTypes);
    }
  
    fetchPokemonTypes();
  },[]);
  
  return {types}
}


  //////////////////////////////////
  function usePokemonData(type){
    
    const [pokemons, setPokemons] = useState([]);
    const pokemonData = async (url) =>{
      const response = await fetch(url);
      const data = await response.json();

      return {
      name: data.forms[0].name,
      type: data.types[0].type.name,
      image: data.sprites.front_default
      }
    }

    const fetchPokemons = useCallback(async () => {
      const temporalPokemons = [];
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=150')
      const data = await response.json();
      for(const pokemonUrl of data.results){
        const pokemon = await pokemonData(pokemonUrl.url);
        temporalPokemons.push(pokemon);
      }
      setPokemons(temporalPokemons);
    },[]);
    
    const pokemonType = useCallback(async() =>{
      const response = await fetch('https://pokeapi.co/api/v2/type/' + type)
      const data = await response.json();
      
      const temporalPokemons = [];
      for(const pokemon of data.pokemon){
        const pokemonUrl = await pokemon.pokemon.url;
        const pokemonResponse = await pokemonData(pokemonUrl);
        temporalPokemons.push(pokemonResponse);
      }
      setPokemons(temporalPokemons);
    },[type]);
    
    useEffect(() => {
      if(type){
        pokemonType();
      }else{
        fetchPokemons();  
      }
    },[type,fetchPokemons,pokemonType]);

    return {pokemons}
      

  }


  export function App() {
  const [select,setSelect]=useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleClickCard = () => {
    setIsOpen(true);
  }
  
  function handledSelectPokemonType(ev)
  {
    setSelect(ev.target.value);
    
  }
  const {pokemons} = usePokemonData(select);
  const {types} = usePokemonType();

  useEffect(() => {  
  },[select]);
  
  return (
    
    <div className="App-container">
      <div className="App-content">
      

        <div className='App-pokemons-content'>
          
          <div className="select-types">
            <label className="filter-label">Filtrar por tipo: </label>
            
            <select id='select-types' onChange={handledSelectPokemonType}>{types.map((type) =>{
              return(
                <option key={type} value={type}>{type}</option>
                );
              })}
            </select>
          </div>

          <div className="pokemons-container">
            <div className="pokemon-container">
              {pokemons.map((poke) => {
                return (
                  <Card key={poke.name} name={poke.name} image={poke.image} type={poke.type} onClick={handleClickCard}/>
                );
              })}
            </div>
          </div>
          
        </div>

      </div>
    </div>

    
  );
}




