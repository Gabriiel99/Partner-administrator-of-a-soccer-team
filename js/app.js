//Creamos un IIFE El cual nos permite que las variables y funciones declaradas adentro se creen de forma local

(function (){

    let DB;

//Una vez cargado el contenido mandamos a llamar a la funcion crearDB()
    document.addEventListener('DOMContentLoaded', () =>{
        crearDB();
    });

    //Creamos la base de datos IndexDB Y abrimos una conexion con crm
    function crearDB(){
        const crearDB = window.indexedDB.open('crm',1);
    
    //En caso que no se pueda crear o abrir xq el navegador no lo soporta
        crearDB.onerror = function(){
            console.log('ERROR BD');
        };
    //SI lo soprta mandamos la variable global DB 
        crearDB.onsuccess = function(){
            DB = crearDB.result;
        }
    //Se ejecuta una vez y nos crea las tablas   
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;

            const objectStore = db.createObjectStore('crm', {
                keypath:'id', autoincrement: true
            });

            objectStore.createIndex('nombre', 'nombre', {unique:false});
            objectStore.createIndex('email', 'email', {unique:true});
            objectStore.createIndex('telefono', 'telefono', {unique:false});
            objectStore.createIndex('documento', 'documento', {unique:true});
            objectStore.createIndex('id', 'id', {unique:true});

            console.log('DB LISTA Y CREADA');
        }
    }
})();