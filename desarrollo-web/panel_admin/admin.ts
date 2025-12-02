import '../../AppTypes';
// @ts-ignore - allow importing CSS as a side-effect for the bundler (no type declarations)
import '../admin/admin.css'; 


// --- 1. INTERFAZ DE DATOS (MODELO) ---
// Define la forma de los datos de usuario que se espera del backend.
interface Rol {
    id_rol: number;
    nombre: string;
}

interface User {
    id_usuario: number;
    id_rol: number; // Aunque se usa Rol.nombre, incluimos id_rol
    nombre: string;
    email: string;
    telefono: string;
    password?: string; 
    Rol: Rol; 
}

// --- 2. CONFIGURACIÓN ---
const API_BASE_URL = 'http://localhost:3001';
// Función auxiliar para obtener el token del localStorage
function getAuthToken(): string | null {
    return localStorage.getItem('authToken');
}
// --- 3. FUNCIONES DE CARGA Y RENDERIZADO ---
/**
 * Carga la lista de usuarios desde el backend y renderiza la tabla.
 */
async function loadUsers(): Promise<void> {
    const tableBody = document.getElementById('user-table-body') as HTMLTableSectionElement;
    if (!tableBody) return;   
    tableBody.innerHTML = ''; //Limpiar
    const token = getAuthToken();
    if (!token) {
        tableBody.innerHTML = `<tr><td colspan="6">Error 401: Sesión no encontrada. Por favor, inicie sesión.</td></tr>`;
        return;
    }


    try {
        const response = await window.http.get(`${API_BASE_URL}/get-users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error('Error al cargar usuarios:', response.status, response.body);
            tableBody.innerHTML = `<tr><td colspan="6">Error ${response.status}: ${response.body.error || 'Token expirado. Vuelve a iniciar sesión.'}</td></tr>`;
            return;
        }

        const users: User[] = response.body;

        users.forEach(user => {
            const row = tableBody.insertRow();
            
            row.insertCell().textContent = user.id_usuario.toString();
            row.insertCell().textContent = user.Rol?.nombre || user.id_rol.toString();
            row.insertCell().textContent = user.nombre;
            row.insertCell().textContent = user.email;
            row.insertCell().textContent = user.telefono || 'N/A';
            
            //Columna de Acciones (Botones)
            const actionCell = row.insertCell();
            actionCell.classList.add('action-col'); // Para centrar los botones
            
            // Usamos template literals para crear los botones y les agregamos el 
            // atributo data-id para identificar el usuario al hacer clic.
            actionCell.innerHTML = `
                <button class="btn show-btn" data-id="${user.id_usuario}" data-action="show">Ver</button>
                <button class="btn edit-btn" data-id="${user.id_usuario}" data-action="edit">Editar</button>
                <button class="btn delete-btn" data-id="${user.id_usuario}" data-action="delete">Eliminar</button>
            `;
        });

        if (users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6">No hay usuarios registrados.</td></tr>`;
        }

    } catch (error) {
        console.error('Fallo de red al intentar cargar usuarios:', error);
        tableBody.innerHTML = `<tr><td colspan="6">Error de conexión con el servidor.</td></tr>`;
    }
}
// --- 4. FUNCIONES CRUD DE ACCIÓN ---
async function handleCreate(event: Event): Promise<void> {
    event.preventDefault();

    const token = getAuthToken();
    const createFormContainer = document.getElementById('create-form-container');
    const createForm = document.getElementById('createUserForm') as HTMLFormElement;
    if (!token) {
        alert('Error de sesión.');
        return;
    }
    const inputNombre = (document.getElementById('inputNombreCreate') as HTMLInputElement).value;
    const inputEmail = (document.getElementById('inputEmailCreate') as HTMLInputElement).value;
    const inputTelefono = (document.getElementById('inputTelefonoCreate') as HTMLInputElement).value;
    const inputPassword = (document.getElementById('inputPasswordCreate') as HTMLInputElement).value;
    const inputRol = (document.getElementById('inputRolIdCreate') as HTMLInputElement).value;   
    const newUserData = {
        nombre: inputNombre,
        email: inputEmail,
        telefono: inputTelefono,
        password: inputPassword,
        id_rol: Number(inputRol) 
    };
    try {
        const response = await window.http.post(`${API_BASE_URL}/create-user`, newUserData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok && response.status === 201) {
            alert('¡Usuario registrado con éxito!');
            // Ocultar el modal y recargar la lista
            createFormContainer?.classList.add('d-none');
            createForm?.reset();

            await loadUsers();
        } else {
            alert(`Error al registrar: ${response.body?.error || 'El email ya existe o verifique los datos.'}`);
        }
    } catch (error) {
        alert('Fallo de red al registrar el usuario.');
        console.error(error);
    }
}

async function handleDeleteUser(userId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) return alert('Error: Token de sesión no encontrado.');

    if (!confirm(`¿Estás seguro de ELIMINAR al usuario con ID ${userId}?`)) {
        return;
    }
    try {
        const response = await window.http.post(`${API_BASE_URL}/delete-user/${userId}`, {}, {
            method: 'DELETE', // Sobreescribe el método a DELETE
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        if (response.ok) {
            alert(`Usuario ${userId} eliminado con éxito.`);
            await loadUsers(); // Refrescar la tabla
        } else {
            alert(`Error al eliminar usuario ${userId}: ${response.body?.error || 'Error desconocido'}`);
            console.error('Error de eliminación:', response.status, response.body);
        }
    } catch (error) {
        alert('Fallo de red al intentar eliminar el usuario.');
    }
}
async function handleEditUser(userId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) return alert('Error: Token de sesión no encontrado.');
    sessionStorage.setItem('tempAuthToken', token);
    sessionStorage.setItem('editUserId', userId);
    
   await window.appNav.toEditUser(userId);
}


function handleTableActionClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('btn')) {
        const userId = target.getAttribute('data-id');
        const action = target.getAttribute('data-action');
        
        if (!userId || !action) {
            console.error('Falta data-id o data-action en el botón.', target);
            return;
        }

        // Aquí se usarían los endpoints de tu routes.js: 
        switch (action) {
            case 'show':
                // Lógica para navegar a la vista del usuario o abrir un modal (usaría GET /get-user/:id)
                alert(`Ver usuario con ID: ${userId}`);
                break;
            case 'edit':
                handleEditUser(userId); 
                break;
            case 'delete':
                handleDeleteUser(userId); 
                break;
            default:
                console.warn(`Acción desconocida: ${action}`);
        }
    }
}

/**
 * Configura todos los Event Listeners para la página.
 */
function setupEventListeners(): void {
    const createFormContainer = document.getElementById('create-form-container');
    // 1. Botón Cerrar Sesión
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn?.addEventListener('click', async () => {
        localStorage.removeItem('authToken'); //Limpiar el token
        console.log('Token JWT eliminado. Navegando a Login.');
        await window.appNav.toLogin(); // Luego, navegar a la página de login.
    });
    // 2. Botón Crear Usuario
    const createBtn = document.querySelector('.create-user-btn');
    createBtn?.addEventListener('click', () =>{
        createFormContainer?.classList.remove('d-none'); // Muestra el div
        createFormContainer?.scrollIntoView({ behavior: 'smooth' }); // Hace scroll
    });
    // 3. Botón Cerrar (CANCELAR)
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    cancelCreateBtn?.addEventListener('click', () => {
        createFormContainer?.classList.add('d-none'); // Oculta el div
        (document.getElementById('createUserForm') as HTMLFormElement)?.reset();
    });

    // 4. Envío del Formulario (dentro del modal)
    const createForm = document.getElementById('createUserForm');
    createForm?.addEventListener('submit', handleCreate);

    // 5. Delegación de Eventos para los botones Ver/Editar/Eliminar en la tabla
    const tableBody = document.getElementById('user-table-body');
    tableBody?.addEventListener('click', handleTableActionClick);
}

// --- 5. INICIALIZACIÓN ---

window.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Panel page loaded. 🛠️');
    setupEventListeners();
    loadUsers();
});