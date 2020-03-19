import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function DevForm({devs, setDevs}){

   const [githubUsername, setGithubUsername] = useState("");
   const [techs, setTechs] = useState("");
   const [latitude, setLatitude] = useState(0);
   const [longitude, setLongitude] = useState(0);

   useEffect(() => {
      navigator.geolocation.getCurrentPosition((position) => {
         const {latitude, longitude} = position.coords;
         setLatitude(latitude);
         setLongitude(longitude);
      }, (err) => {
         console.log(err);
      }, {
         timeout: 30000,
      })
   }, []);

   async function handleAddDev(event) {
      event.preventDefault();
  
      const response = await api.post("/devs", {
        githubUsername,
        techs,
        latitude, 
        longitude
      });
  
      setGithubUsername("");
      setTechs("");
      setDevs([...devs, response.data]);
    }

   return (
      <form onSubmit={handleAddDev}>
         <div className="input-block">
         <label htmlFor="githubUsername">Usuário do Github</label>
         <input value={githubUsername} onChange={e => setGithubUsername(e.target.value)} name="githubUsername" id="usernameGithub" required />
         </div>
         <div className="input-block">
         <label htmlFor="techs">Tecnologias</label>
         <input value={techs} onChange={e => setTechs(e.target.value)} name="techs" id="techs" required />
         </div>
         <div className="input-group">
         <div className="input-block">
            <label htmlFor="latitude">Latitude</label>
            <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)}name="latitude" id="latitude" required />
         </div>
         <div className="input-block">
            <label htmlFor="longitude">Longitude</label>
            <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)} name="longitude" id="longitude" required />
         </div>
         </div>
         <button type="submit">Salvar</button>
      </form>
   );
}

export default DevForm;