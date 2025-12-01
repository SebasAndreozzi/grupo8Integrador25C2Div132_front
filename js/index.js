let contenedorProductos = document.getElementById("contenedor-productos");
let catalogoCarrito = document.getElementById("catalogo-carrito")
let carrito = [];
let usrNombre = obtenerNombre();

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
                <div class="card-button">
                    <input type="number" class="contador-unidades" min="1" id="cantidad${producto.id}" value="1">
                    <button class="button" data-producto='${JSON.stringify(producto)}' onclick="agregarACarrito(this.dataset.producto, document.getElementById('cantidad${producto.id}').value)">Agregar</button>
                </div>
            </div>
        `;

    });
    contenedorProductos.innerHTML = htmlProducto;

}

/*===================
Funcines de filtro
====================*/
function iniciarFiltros(array){
    let todos = document.getElementById("logo");
    todos.addEventListener("click", () =>{
        mostrarProductos(array)
    })

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
                    <input type="number" class="contador-unidades" min="1" id="cantidad${producto.id}" value="1">
                    <button class="button" data-producto='${JSON.stringify(producto)}' onclick="agregarACarrito(this.dataset.producto, document.getElementById('cantidad${producto.id}').value)">Agregar</button>
                </div>
            `;
        }

    });
    contenedorProductos.innerHTML = htmlProducto;
}

/*=========================================================
Funciones de obtención y eliminación del nombre de usuario
===========================================================*/

function obtenerNombre(){
    if(localStorage.getItem("nombre")){
        return localStorage.getItem("nombre");
    }
    else{
      window.location.href = "./login.html";  
    }

}
/*
window.addEventListener("beforeunload", () =>{
    localStorage.removeItem("nombre");
})*/

/*====================
Funcines de carrito
=====================*/

let imgCarrito = document.getElementById("img-carrito");
imgCarrito.addEventListener("click", () =>{
    mostrarCarrito();
})

function mostrarCarrito(){

    let htmlCarrito =`
        <h1>Carrito</h1>
        <hr class="separador">
        <div class="contenedor-carrito">`;

    carrito.forEach((producto)=> {

        htmlCarrito += `
            <div class= "card-producto">
                <img src="${producto.img}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${Number(producto.precio)*Number(producto.cantidad)}</p>
                <button class="button" onclick="restarUnidad(${producto.id})">-</button>
                <input type="number" min="0" class="contador-unidades" id="carritoCantidad${producto.id}" value="${producto.cantidad}" disabled>
                <button class="button" onclick="agregarUnidad(${producto.id})">+</button>
            </div>
        `;
 
    });

    htmlCarrito += `</div><p class="total">TOTAL: $${calcularTotal()}</p><button class=button onclick="finalizarCompra()">Finalizar compra</button>`

    if(carrito.length > 0){
        catalogoCarrito.innerHTML = htmlCarrito;
    }

}

function actualizarCarrito(id, cant){
    for(let item in carrito){
        if(item.id == id){
            item.cantidad = cant;
            break;
        }
    }
    mostrarCarrito();
}

function actualizarCantidadCarrito(){
    let contadorCarrito = document.getElementById("contador-carrito");

    let total = 0;

    if(carrito.length > 0){
        carrito.forEach((item) => {
            total += Number(item.cantidad);
        })
    }
    
    contadorCarrito.innerHTML = `${total}`;
}

function agregarACarrito(producto, cant){
    agregarProd = JSON.parse(producto);
    agregarProd.cantidad = cant;

    if(carrito.length > 0){
        for(let item of carrito){
            if(item.id === agregarProd.id){
                item.cantidad = Number(item.cantidad) + Number(cant);
                break;
            }
            else{
                carrito.push(agregarProd);
                break;
            }
        } 

    }else{
        carrito.push(agregarProd);

    }

    actualizarCantidadCarrito();
    
    if(catalogoCarrito.innerHTML.trim() != ''){
        mostrarCarrito();
    }
}

function agregarUnidad(prodId){
    for(let item of carrito){
        if(item.id === prodId){
            item.cantidad = Number(item.cantidad) + 1;
            break; 
        }
    }
    actualizarCantidadCarrito();
    actualizarCarrito()
    mostrarCarrito();
}

function restarUnidad(prodId){
    for(let item of carrito){
        if(item.id === prodId){
            item.cantidad = Number(item.cantidad) - 1;
            if(item.cantidad === 0){
                carrito.splice(carrito.indexOf(item), 1)
            }
            break; 
        }
    }
    actualizarCantidadCarrito();
    if(carrito.length === 0){
        vaciarCarrito();
    }else{
        actualizarCantidadCarrito();
        actualizarCarrito();
        mostrarCarrito();
    }
    
}

function vaciarCarrito(){
    carrito = [];
    catalogoCarrito.innerHTML = "";
}

function calcularTotal(){
    total = 0;

    carrito.forEach((item) => {
        total += Number(item.precio) * Number(item.cantidad);
    })

    console.log(total);
    return total;
}

function finalizarCompra(){
    if(confirm("Desea confirmar la compra")){
        calcularTotal();
    }
}

/*==============================
================================*/

function init() {
    obtenerProductos();
}

init();