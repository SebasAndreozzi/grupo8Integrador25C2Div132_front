let contenedorProductos = document.getElementById("contenedor-productos");
let contenedorCarrito = document.getElementById("contenedor-carrito")
let carrito = [];

async function obtenerProductos(){
    try {
        // Hago el fetch a la url personalizada
        let response = await fetch(`http://localhost:3000/api/productos/cliente`);

        // Proceso los datos que me devuelve el servidor
        let datos = await response.json();

        if (!response.ok) {
            mostrarError(datos.message || "No se pudo obtener el producto");
            return;
        }
        // Extraigo el producto que devuelve payload
        let productos = datos.payload; // Apuntamos a la respuesta, vamos a payload que trae el array con el objeto y extraemos el primer y unico elemento

        // Le pasamos el producto a una funcion que lo renderice en la pantalla
        mostrarProductos(productos);
        iniciarFiltros(productos);

    } catch (error) {
        console.error("Error: ", error);
    }

}

function mostrarProductos(array)
{
    let htmlProducto ="";

    array.forEach(producto=> {
            htmlProducto += `
            <div class= "card-producto">
                <img src="${producto.img}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <input type="number" min="1" id="cantidad${producto.id}" value="1">
                <button class="button" data-producto='${JSON.stringify(producto)}' onclick="agregarACarrito(this.dataset.producto, document.getElementById('cantidad${producto.id}').value)">Agregar al carrito</button>
            </div>
        `;

    });
    contenedorProductos.innerHTML = htmlProducto;

}

/*===================
Funcines de filtro
====================*/
function iniciarFiltros(array){
    let sellado = document.getElementById("filtro-sellado");
    sellado.addEventListener("click", () =>{
        filtrarPorTipo(array, sellado.textContent);
    })

    let accesorio = document.getElementById("filtro-accesorio");
    accesorio.addEventListener("click", () =>{
        filtrarPorTipo(array, accesorio.textContent);
    })
}

function filtrarPorTipo(array, tipo){
    let htmlProducto ="";

    array.forEach(producto=> {
        if(producto.tipo === tipo){
            htmlProducto += `
                <div class= "card-producto">
                    <img src="${producto.img}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p>$${producto.precio}</p>
                    <button class="button" data-producto='${JSON.stringify(producto)}' onclick="agregarACarrito(this.dataset.producto)">Agregar al carrito</button>
                </div>
            `;
        }

    });
    contenedorProductos.innerHTML = htmlProducto;
}

/*====================
Funcines de carrito
=====================*/

let imgCarrito = document.getElementById("img-carrito");
imgCarrito.addEventListener("click", () =>{
    mostrarCarrito();
})

function mostrarCarrito(){

    let htmlCarrito ="";

    carrito.forEach((producto, i)=> {
        let prod = JSON.parse(producto);

        htmlCarrito += `
            <div class= "card-producto">
                <img src="${prod.img}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>$${prod.precio}</p>
                <button class="button" onclick="eliminarElemento(${i})">Eliminar</button>
            </div>
        `; 
    });

    htmlCarrito += `<button class=button>Finalizar compra</button>`

    if(carrito.length > 0){
        contenedorCarrito.innerHTML = htmlCarrito;
    }

}

function actualizarCantidadCarrito(){
    let contadorCarrito = document.getElementById("contador-carrito");
    
    contadorCarrito.innerHTML = `${carrito.length}`;
}

function agregarACarrito(producto, cantidad){
    for(let i=0; i < cantidad; i++){
        carrito.push(producto);
    }

    actualizarCantidadCarrito();
    
    if(contenedorCarrito.innerHTML.trim() != ''){
        mostrarCarrito();
    }
}

function eliminarElemento(indice){
    carrito.splice(indice, 1);
    actualizarCantidadCarrito();

    if(carrito.length === 0){
        vaciarCarrito();

    }else{
        mostrarCarrito();
    }
}

function vaciarCarrito(){
    carrito = [];
    contenedorCarrito.innerHTML = "";
}

/*==============================
================================*/

function init() {
    obtenerProductos();
}

init();