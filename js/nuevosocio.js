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
})();