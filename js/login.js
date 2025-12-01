let usrNameForm = document.getElementById("usrNameForm");

usrNameForm.addEventListener("submit", event => {
    
    event.preventDefault();

    let usrName = document.getElementById("usrName");

    if (validarNombre(usrName.value)){
        localStorage.setItem("nombre", usrName.value);

        window.location.href = "./index.html";
    }
})

function validarNombre(nombre){
    if(String(nombre).length <= 0){
        alert("Debe ingresar su nombre.");
        return false;
    }
    else{
        return true;
    }
    
}