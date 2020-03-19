const Dev = require("../models/dev");
const axios = require("axios");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
   async index(req, res){
      try{
         const devs = await Dev.find();
         res.status(200).json(devs);
      } catch (err) {
         res.status(500).json({ message: err.message });
      }
   },
   async store(req, res){
      const {githubUsername, techs, latitude, longitude} = req.body;
      let dev = await Dev.findOne({githubUsername});
      if(!dev){
         try {
            const response = await axios.get(`https://api.github.com/users/${githubUsername}`);

            const { name = login, bio, avatar_url } = response.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
               type: "Point",
               coordinates: [longitude, latitude],
            }

            dev = new Dev({
               name,
               bio,
               avatarUrl: avatar_url,
               githubUsername, 
               techs: techsArray,
               location
            });

            const newDev = await dev.save(); 
            res.status(200).json(newDev);
         } catch (err) {
            res.status(500).json({ message: err.message})
         }
      }else {
         res.status(200).json(dev);
      }
   },
   async destroy(req, res){
      const { id } = req.params;
      try {
         const dev = await Dev.findById(id);
         dev.remove();
         res.status(201).json({ message: "Dev deleted" });
      } catch (err) {
         res.status(500).json({ message: err.message });
      }
   }
}