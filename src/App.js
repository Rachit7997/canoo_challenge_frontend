import './App.css';
import { useState, useEffect } from 'react';


function Header(){
  return (
    <header>
      <h1>
        Home automation
      </h1>
    </header>
  )
}

function MainLights(){
  const init = []
  const[lightData, setLightData] = useState(init)
  const [newLight, setNewLight] = useState(null)
  const [updatedLight, setUpdatedLight] = useState(null)
  const [deletedLight, setDeletedLight] = useState(null)

  const STATES = {1:"ON", 0:"OFF"}
  

  function addLight(){
    
    let name = prompt("Enter the name of a new Light",'L1')
    if(!name){
      name = "default"
    }

    const aLight={ 
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"name":name, "state":0})
    }
    fetch('http://127.0.0.1:8000/api/v1/lights/new', aLight)
      .then((response) => response.json())
      .then(setNewLight); 
  }

  function updateLight(e){
    let value = parseInt(e.target.value)
    let id = parseInt(e.target.id)
    value = (value === 0) ? 1 : 0 //switching the state of light
    const updation={
      method:'PUT',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({'state':value})
    }
    console.log(typeof(id))
    console.log(`id:${id}\tvalue:${value}`)
    fetch(`http://127.0.0.1:8000/api/v1/lights/${id}/`, updation)
      .then((response) => response.json())
      .then(setUpdatedLight);
  }

  function deleteLight(e){
    let id = parseInt(e.target.id)

    const deletion={
      method:'DELETE',
      headers:{'Content-Type': 'application/json'},
    }

    console.log(`Trying to delete light with id: ${id}`)
    fetch(`http://127.0.0.1:8000/api/v1/lights/${id}/`,deletion)
    .then(response => response.text())
    .then((grabage)=>(setDeletedLight(id)));
  }

  useEffect(()=>{
      console.log("Just Rerendered")
      console.log(JSON.stringify(updatedLight))
      fetch('http://127.0.0.1:8000/api/v1/lights/')
        .then((response) => response.json())
        .then(setLightData);
  }, [newLight, updatedLight, deletedLight])
  
  return (
    <section style={{ textAlign: "center" }}>
      <button onClick={addLight}>Add Light</button>
      <table style={{ textAlign: "center" }}>{
        lightData.map((light, index) => (
          <tbody key={index}>
            <tr>
              <td>{light['id']}</td>
              <td>{light['name']}</td>
              <td><b>{STATES[light['state']]}</b></td>
              <td>
                <button id={light['id'].toString()} value={light['state'].toString()} 
                onClick={e => updateLight(e, "id", "value")}>
                  Switch
                </button>
              </td>
              <td>
                <button id={light['id'].toString()} 
                onClick={e => deleteLight(e, "id")} style={{color:'red'}}>
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
          )
        )
      }
      </table>
    </section>
  )
}

function MainThermostate(){
  const [temperature, setTemperature] = useState(64.00);

  useEffect(() => {
    fetch('api/v1/thermostate/1/')
    .then(response=>response.json())
    .then((e)=>{setTemperature(e['temp'])})
  },
  [temperature]
  )

  function setThermostat(){
    let temp = prompt("Please enter the temperature to set thermostat", "64")
    if(!isNaN(temp) && !isNaN(parseFloat(temp))){
      temp = parseFloat(parseFloat(temp).toFixed(2))
      const id = 1
      const updation={
        method:'PUT',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({'temp':temp})
      }
      fetch(`api/v1/thermostate/${id}/`, updation)
      .then(response => response.json())
      .then((e)=>{setTemperature(e['temp'])})
    }else{
      alert("Please enter the valid temperature")
    }
  }  

  return (
    <section>
      <h3>Thermostate   <b>{temperature}</b> <button onClick={setThermostat}>SET</button></h3>
    </section>
  )

}

function Footer(){
  return(
    <footer>
      Desinged by Rachit Patel
    </footer>
  )
}

function App() {
  return (
    <div className="App">
      <Header />
      <MainLights />
      <MainThermostate />
      <Footer />
    </div>
  );
}

export default App;
