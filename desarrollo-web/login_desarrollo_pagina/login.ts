// Importar Bootstrap CSS y JS como módulo ESM
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './login.css';
import '../../AppTypes';


document.addEventListener('DOMContentLoaded', () => {
    console.log('Login page loaded');
    const btn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('inputEmail') as HTMLInputElement;
    const passwordInput = document.getElementById('inputPassword') as HTMLInputElement;
    const container = document.querySelector(".container");
    const btnSignIn = document.getElementById("btn-sign-in");
    const btnSignUp = document.getElementById("btn-sign-up");

    btn?.addEventListener('click', async () => {
    console.log('Login clickeado');

    btnSignIn.addEventListener("click", () => {
    container.classList.remove("toggle");
    });

    btnSignUp.addEventListener("click", () => {
    container.classList.add("toggle");
    });

    const res = await window.http.post('http://localhost:3001/user-login',{
        email: emailInput.value,
        password: passwordInput.value
    });
    console.log (res);

    if (!res.ok){
        showAlert(res.body.error, 'danger');
        console.error('Error en la petición:', res.status);
    } else {
        showAlert('Login exitoso!', 'success');
        await window.appNav.toHome();
        console.log(res);
    }
    });
    //window.appNav.toHome() 

//Función para mostrar alertas
function showAlert(message: string, type: string) {
    const alertPlaceholder = document.getElementById('livealertPlaceholder');
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [ 
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
        ].join('')
        
        alertPlaceholder?.append(wrapper)
    }
});



  