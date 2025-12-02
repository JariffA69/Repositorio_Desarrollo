import 'bootstrap/dist/css/bootstrap.min.css';
// @ts-ignore: allow importing CSS files without type declarations
import './home2.css';
import '../../AppTypes';


window.addEventListener('DOMContentLoaded', () => {
    console.log('Home page loaded');  

  const backBtn = document.getElementById('btn_InicioSesion');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
    window.appNav.toLogin()
    });
  }
});