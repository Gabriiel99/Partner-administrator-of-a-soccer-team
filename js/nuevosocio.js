//Creamos un IIFE El cual nos permite que las variables y funciones declaradas adentro se creen de forma local
(function (){

    let DB;//Volvemos a cargar esta variable para no mezclar con las otras

    //Seleccionamos el formulario en el cual trabajaremos del HTML nuevo-socio
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () =>{

    //Nos conectamos a la Base de datos 
        conectarDB();

        formulario.addEventListener('submit', validarSocio);
    });

    function conectarDB(){
        //Nos conectamos a db    
        const abrirConexion = window.indexedDB.open('db',2);

        //Si la base de dato NO existe o hay un error
        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        };

        //Si todo esta correcto
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    }

    //Como es un submit tomara e
    function validarSocio(e){
        e.preventDefault();
        console.log('validando');

        //Leer los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const documento = document.querySelector('#documento').value;

        if(nombre ==='' || email === '' || telefono === '' || documento === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
       //Crear un objeto
        const socio = {
            nombre,
            email,
            telefono,
            documento
        }
        socio.id = Date.now();
        
        crearNuevoSocio(socio);
    }
    
    function crearNuevoSocio(socio){
        const transaction = DB.transaction(['db'], 'readwrite');

        const objectStore = transaction.objectStore('db');

        objectStore.add(socio);

        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');
        };

        transaction.onecomplete = function(){
            imprimirAlerta('El cliente se agregó correctamente');

            setTimeout(() =>{
                window.location.href= 'index.html';
            },3000);
        }
    }


    //Esta funcion tomara un mensaje y un tipo dependiendo el caso
    function imprimirAlerta(mensaje,tipo){

        const alerta = document.querySelector('.alerta');

        if(!alerta){

            //crear la alerta
            const divMensaje = document.createElement('div');
            //agregamos clases con tailwind
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg','mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

            if(tipo === 'error'){
                divMensaje.classList.add('bg-red-100', 'border-red-400' , 'text-red-700');
            }else{
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }

            //Agregamos el mensaje dependiendo el caso
            divMensaje.textContent = mensaje;

            //Lo agreamos al DOM al divmensaje
            formulario.appendChild(divMensaje);

            //Despues de 3 segundo la alerta desaparece
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
    }}
})();