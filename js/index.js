let contenedorProductos = document.getElementById("contenedor-productos");
let catalogoCarrito = document.getElementById("catalogo-carrito")
let carrito = [];
if(JSON.parse(sessionStorage.getItem("carrito"))){
    carrito = JSON.parse(sessionStorage.getItem("carrito"));
    actualizarCantidadCarrito();
}
let usrNombre = obtenerNombre();

/*=======================
Funciones de obtención
=========================*/

function obtenerNombre(){
    if(sessionStorage.getItem("nombre")){
        return sessionStorage.getItem("nombre");
    }
    else{
      window.location.href = "./login.html";  
    }

}

async function obtenerProductos(){
    try {
        let response = await fetch(`http://localhost:3000/api/productos/cliente`);

        let datos = await response.json();

        if (!response.ok) {
            mostrarError(datos.message || "No se pudo obtener el producto");
            return;
        }
 
        let productos = datos.payload;
        
        mostrarProductos(productos);
        iniciarFiltros(productos);

    } catch (error) {
        console.error("Error: ", error);
    }

}

async function obtenerProductoPorId(id){
    try {
        let response = await fetch(`http://localhost:3000/api/productos/cliente/${id}`);


        // Proceso los datos que me devuelve el servidor
        let datos = await response.json();
        
        if (!response.ok) {
            mostrarError(datos.message || "No se pudo obtener el producto");
            return;
        }
        
        let producto = datos.payload; 

        return producto[0];


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
                    <button class="button" onclick="agregarACarrito(${producto.id}, document.getElementById('cantidad${producto.id}').value)">Agregar</button>
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
                    <button class="button" onclick="agregarACarrito(${producto.id}, document.getElementById('cantidad${producto.id}').value)">Agregar</button>
                </div>
            `;
        }

    });
    contenedorProductos.innerHTML = htmlProducto;
}

async function obtenerVentaProductoPorId(id){
    try {
        // Hago el fetch a la url personalizada
        let response = await fetch(`http://localhost:3000/api/ventaproducto/${id}`);

        // Proceso los datos que me devuelve el servidor
        let datos = await response.json();
        
        if (!response.ok) {
            mostrarError(datos.message || "No se pudo obtener el producto");
            return;
        }
        // Extraigo el producto que devuelve payload
        let productos = datos.payload; // Apuntamos a la respuesta, vamos a payload que trae el array con el objeto y extraemos el primer y unico elemento
        
        // Le pasamos el producto a una funcion que lo renderice en la pantalla
        return(productos);

    } catch (error) {
        console.error("Error: ", error);
    }

}

/*====================
Funcines de carrito
=====================*/

let imgCarrito = document.getElementById("img-carrito");
imgCarrito.addEventListener("click", () =>{
    mostrarCarrito();
})

async function mostrarCarrito(){

    let htmlCarrito =`
        <h1>Carrito</h1>
        <hr class="separador">
        <div class="contenedor-carrito">`;

    for (const producto of carrito) {

        let prod = await obtenerProductoPorId(producto.id);
        
        htmlCarrito += `
            <div class= "card-producto">
                <img src="${prod.img}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>$${Number(prod.precio)*Number(producto.cantidad)}</p>
                <button class="button" onclick="restarUnidad(${prod.id})">-</button>
                <input type="number" min="0" class="contador-unidades" id="carritoCantidad${prod.id}" value="${producto.cantidad}" disabled>
                <button class="button" onclick="agregarUnidad(${prod.id})">+</button>
            </div>
        `;
    };

    htmlCarrito += `</div><p class="total">TOTAL: $${await calcularTotal()}</p><button class=button onclick="finalizarCompra()">Finalizar compra</button>`

    if(carrito.length > 0){
        catalogoCarrito.innerHTML = htmlCarrito;
    }

}

function actualizarCarrito(id, cant){
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
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

    if(cant < 1){
        return
    }

    let agregarProd = {
        id : producto,
        cantidad: cant
    }

    if(carrito.length > 0){
        let cantActualizada = false;
        for(let item of carrito){
            if(item.id === agregarProd.id){
                item.cantidad = Number(item.cantidad) + Number(cant);
                cantActualizada = true; 
                break
            }
        }
        if(!cantActualizada){
            carrito.push(agregarProd);
        }

    }else{
        carrito.push(agregarProd);

    }

    actualizarCantidadCarrito();
    actualizarCarrito();
    
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
    sessionStorage.removeItem("carrito");
    actualizarCantidadCarrito();
}

async function calcularTotal(){
    total = 0;

    for(let item of carrito){
        let producto = await obtenerProductoPorId(item.id);
        total += Number(producto.precio) * Number(item.cantidad);
    }

    return total;
}

async function finalizarCompra() {
    if (confirm("¿Desea confirmar la compra?")) {
        let url = "http://localhost:3000/api/ventas";

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario: usrNombre,
                    productos: carrito
                })
            });

            let result = await response.json();

            if (response.ok){
                alert(result.message);
                let ventaId = result.payload;
                await imprimirTicket(ventaId);
                vaciarCarrito();
            } else {
                console.log(result.message);
            }

        } catch (error) {
            console.error("Error al finalizar compra: ", error);
            alert("Error al procesar la solicitud");
        }
    }
}

async function imprimirTicket(id){

    let ticket = await obtenerVentaProductoPorId(id)

    let productosTicket = [];

    for(let item of ticket){
        let producto = await obtenerProductoPorId(item.productos_id);
        productosTicket.push(producto);
    }
    
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);

    doc.text("Ticketmon de compra: ", 20, y);

    y += 15;

    doc.setFontSize(12);

    for(let i = 0; i < productosTicket.length; i++){

        doc.text(`${productosTicket[i].nombre} - $${ticket[i].precio}`, 30, y);

        y += 10;
    }

    let montoFinal = await calcularTotal();

    y += 5;

    doc.setFontSize(14);

    doc.text(`Total: $${montoFinal}`, 20, y);

    doc.save("ticket.pdf");
}

/*==============================
================================*/

function init() {
    obtenerProductos();
}

init();
