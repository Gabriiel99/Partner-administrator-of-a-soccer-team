//Creamos un IIFE El cual nos permite que las variables y funciones declaradas adentro se creen de forma local

(function (){

    let DB;

//Una vez cargado el contenido mandamos a llamar a la funcion crearDB()
    document.addEventListener('DOMContentLoaded', () =>{
        crearDB();

        //Esta funcion se ejecutara solo si existe la bd 
        if(window.indexedDB.open('db',2)){
            obtenerSocios();
        }
    });

    //Creamos la base de datos IndexDB Y abrimos una conexion 
    function crearDB(){
        const crearDB = window.indexedDB.open('db',2);
    
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

            const objectStore = db.createObjectStore('db', {
                keyPath:'id', autoincrement: true
            });

            objectStore.createIndex('nombre', 'nombre', {unique:false});
            objectStore.createIndex('email', 'email', {unique:true});
            objectStore.createIndex('telefono', 'telefono', {unique:false});
            objectStore.createIndex('documento', 'documento', {unique:true});
            objectStore.createIndex('id', 'id', {unique:true});

            console.log('DB LISTA Y CREADA');
        }
    }

    function obtenerSocios(){

        //abrimos la conexion
        const abrirConexion = window.indexedDB.open('db',2);

        //Si hubo un error
        abrirConexion.onerror = function(){
            console.log('ERROR');
        };

        //Si fue correcto
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;

            //Accedemos al objectStore
            const objectStore = DB.transaction('db').objectStore('db');

            //Utilizamos cursor
            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    //Extraemos estos valores con destructuring
                    const{nombre, email, telefono, documento, id} = cursor.value;

                    //Seleecionamos la tabla
                    const listadoSocios = document.querySelector('#listado-socios');
                    //Colocamos y mostramos todos los registros en la tabla
                    listadoSocios.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${documento}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-socio.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-socio="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
                        </td>
                    </tr>
                `;
                //Traer a los siguientes socios
                    cursor.continue();
                }else{
                    console.log('No hay mas registros...');
                }
            }
        }
    }

})();