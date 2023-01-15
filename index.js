const express =require ('express');
const bodyParser = require ('body-parser');
const pg = require ('pg');
const { text } = require('body-parser');




// CONEXION A BASE DE DATOS

const config = {
    user:'postgres',
    database :'PROYECTO',
    password:'0000',
    host:'192.168.100.29',
    port :5432,
    ssl:false,
    idleTimeoutMillis : 30000
}

const client = new pg.Pool(config)

//MODELO
class Usuario {
    constructor () {
        
    }
    async getTodos (){
        const response = await client.query('select * from usuario')
        //console.log (response.rows);
        return response.rows;
    }

    async getPromedio (){
        const response = await client.query('select AVG (ALL edad) from usuario')
        //console.log (response.rows);
        //return response.rows.text;
        return response.rows;
    }

    getStatus(){
        const status ={
            "namesystem":"SISTEMA API- GESTION USUARIOS",
            "api-users":"ALL",
            "version ":"0.0.2",
            "desarrollador":"OMAR HINOJOSA BALLON",
            "email":"omarhb@gmail.com"
        }
        return status
    }

    async addTodo (todoText){
        
        
        
        const query ='INSERT INTO usuario (nombre_completo,edad) VALUES ($1,$2)'
        const {nombre_completo,edad}=todoText;
        const values = [nombre_completo,edad]
        //console.log(todoText)
        //console.log (query)
        const response = await client.query(query,values)
        return response.rows;
    }
}

//CONTROLADOR

class UsuarioControlador {
    constructor (model){
        this.model=model;
    }
    async getTodos (){
       return await this.model.getTodos();
    }
    async addTodo (todoText){
       await this.model.addTodo(todoText);
    }
    async getPromedio(){
        return await this.model.getPromedio();
    }
    getStatus(){
        return this.model.getStatus();
    }
}


const  usuario =new Usuario();
const usuarioControlador = new UsuarioControlador(usuario);
const app =express ();


//SETTINGS

app.set ('jason spaces',2);
app.use(bodyParser.json());
app.use(express.json());

//VISTA

//GET LISTA USUARIOS
 app.get ("/usuarios", async (req,res)=> {
    //return 1;
    const response = await usuarioControlador.getTodos();
    res.json(response);
})

//GET PROMEDIO
app.get ("/usuarios/promedio", async (req,res)=> {
    //return 1;
    const response = await usuarioControlador.getPromedio();
    res.json(response);
    console.log(response);
})

//GET STATUS
app.get ("/usuarios/status", async (req,res)=> {
    //return 1;
    const response = usuarioControlador.getStatus();
    res.json(response);
    console.log(response);
})


//POST USUARIOS NUEVOS DESDE JSON
app.post ("/usuarios", (req,res) => {
    usuarioControlador.addTodo(req.body);
    res.sendStatus(200);
}


)
app.listen(3000,()=>{
    console.log("Escuchando puerto 3000");
});