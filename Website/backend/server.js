import  { config } from 'dotenv';
import express from 'express';
import { getUCLBuildings, getAccommodations, getWalkingRoutesFor } from './google-map/mapquery.js'

config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

//Listen for requests from the client
app.listen(PORT, () => {
    console.log(`Server Listening on PORT: ${PORT}`);
  });

app.get('/status', (req, res) => {
    const status = {
       "Status": "Running"
    };    
    res.send(status);
 });
//respond to /uclbuildings request 
 app.get('/uclbuildings', async (req, res) => {
   try 
   {
      res.send(await getUCLBuildings());
   } catch (error) {
      res.status(500).send('Error fetching UCL buildings');
   }
 });
//respond to /uclaccommodations request
 app.get('/uclaccommodations', async (req, res) => {
   try 
   {
      res.send(await getAccommodations());
   } catch (error) {
      res.status(500).send('Error fetching UCL buildings');
   }
 });
//respond to /getwalkingroutes request 
//the api needs an object in the body with the following structure :
//{ 
//"location" : {
//    "latitude": lat,
//    "longitude": long
//    },
// "duration": sec
//}
 app.get('/getwalkingroutes', async (req, res) => {
   try {
      const param = req.body;
      res.send(await getWalkingRoutesFor(param.location, param.duration));
   } catch (error) {
     res.status(500).send('Error fetching walking routes');
   }
 });
