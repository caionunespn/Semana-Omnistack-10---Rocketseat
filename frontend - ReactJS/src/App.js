import React, { useState, useEffect } from 'react';
import api from './services/api';
import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

import "./global.css";
import "./App.css";
import "./Sidebar.css";
import "./Main.css";

function App(){

  const [devs, setDevs] = useState([]);
  

  useEffect(() => {
    async function getDevs() {
      const response = await api.get("/devs");
      setDevs(response.data);
    }

    getDevs();
  }, []);

  return(
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm devs={devs} setDevs={setDevs}/>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;