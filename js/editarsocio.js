(function () {
    let DB;
    let idSocio;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const documentoInput = document.querySelector('#documento');

    const formulario = documento.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () =>{
        conectarDB();

        //actualizar el formulario
        formulario.addEventListener('submit', actualizarSocio);

        //Verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        const idSocio = parametrosURL.get('id');
        console.log(idSocio);
        if(idSocio){
            setTimeout(() =>{
                obtenerSocio(idSocio);
            },100);
            
        }
    });

    function actualizarSocio(e){
        e.prevent.default();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || 
        documentoInput === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        //Actualizar Socio
        const socioActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            documento: documentoInput.value,
            id: Number(idSocio)
        };

        const transaction = DB.transaction(['db'], 'readwrite');
        const objectStore = transaction.objectStore('db');

        objectStore.put(socioActualizado);

        transaction.onecomplete = function (){
            imprimirAlerta('Editado correctamente');

            setTimeout(() =>{
                window.location.href = 'index.html';
            },3000);
        };

        transaction.onerror = function (){
            imprimirAlerta('Hubo un error','error');
        };
    }

    function obtenerSocio(id){
        const transaction = DB.transaction(['db'], 'readwrite');
        const objectStore = transaction.objectStore('db');

        const socio = objectStore.openCursor();
        socio.onsuccess = function (e){
            const cursor = e.target.result;

            if(cursor){
                console.log(cursor.value);
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosSocio){
        const {nombre, email,telefono,documento} = datosSocio;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        documentoInput.value = documento;

    }

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
})