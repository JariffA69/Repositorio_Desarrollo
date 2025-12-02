import './home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../AppTypes';


window.addEventListener('DOMContentLoaded', () => {
    console.log('Home page loaded');  

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
    window.appNav.toLogin()
    });
  }
});