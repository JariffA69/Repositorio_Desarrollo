import express from 'express'; 
import { Database } from './src/config/database.config.js'; 
import { RelationshipConfig } from './src/config/relationships.config.js';
import { UserRoute } from './src/routes/routes.js';



const app = express();
const port = 3001 || 3002;



const database = new Database(); 
database.connection(); 

//sincronizar los modelos con la base de datos
//sequelize.sync();

app.use(express.json()); //Para que el servidor entienda JSON
app.use(express.urlencoded({ extended: true })); //Para que el servidor entienda datos de formularios


app.get('/hola', (req, res) => {
  res.send('Hello World!')
})
const relationshipConfig = new RelationshipConfig();
relationshipConfig.initRelationships();

const userRoute = new UserRoute(app);
userRoute.initUserRoutes();


app.listen(port, () => { 

    console.log(`app listening on port ${port}`) 

});




