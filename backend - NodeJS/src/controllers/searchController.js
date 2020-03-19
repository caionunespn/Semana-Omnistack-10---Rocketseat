const Dev = require("../models/dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
   async index(req, res) {
      const { latitude, longitude, techs } = req.query;

      const techsArray = parseStringAsArray(techs);

      try {

         const devs = await Dev.find({
            techs: {
               $in: techsArray,
            },
            location: {
               $near: {
                  $geometry: {
                     type: "Point",
                     coordinates: [longitude, latitude]
                  },
                  $maxDistance: 10000,
               }
            }
         })

         res.status(200).json(devs);

      } catch (err) {
         res.status(500).json({ message: err.message });
      }
   }
}