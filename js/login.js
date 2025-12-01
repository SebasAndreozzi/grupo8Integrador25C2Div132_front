let usrNameForm = document.getElementById("usrNameForm");

usrNameForm.addEventListener("submit", event => {
    
    event.preventDefault();

    let usrName = document.getElementById("usrName");
    console.log(typeof usrName.value)

    if (validarNombre(usrName.value)){
        localStorage.setItem("nombre", usrName.value);

        window.location.href = "./index.html";
    }
})

function validarNombre(nombre){
    if(typeof nombre !== typeof "String"){
        return false;
    }
    else{
        return true;
    }
    
}