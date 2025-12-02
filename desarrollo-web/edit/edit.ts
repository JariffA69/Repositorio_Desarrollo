// Importar Bootstrap CSS y JS como módulo ESM
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../AppTypes'
import 'bootstrap'

document.addEventListener('DOMContentLoaded', async () => {
  interface User {
    id_usuario: number;
    nombre: string;
    email: string;
    telefono: string;
    id_rol: number;
    rol?: {nombre: string};
  }

  // Obtener el ID del usuario desde los query parameters
  const params = new URLSearchParams(window.location.search);
  const userId = (params.get('id'));

const inputNombre = document.getElementById("inputNombre") as HTMLInputElement;
const inputEmail = document.getElementById("inputEmail") as HTMLInputElement;
const inputTelefono = document.getElementById("inputTelefono") as HTMLInputElement;
const userNameDisplay = document.getElementById("user-name-display") as HTMLElement;

const form = document.getElementById("editUserForm") as HTMLFormElement;
const backBtn = document.getElementById("backToAdminBtn") as HTMLButtonElement;
  
if (!userId) {
    alert("Error: No se especificó un usuario.");
    return;
}

  // Cargar datos del usuario
async function cargarUsuario() {
    try {
        const res = await window.http.get(`http://localhost:3001/get-user/${userId}`);

        let user: User;

        // Normalizar (para cuando window.http regresa {body:...})
        if (res && typeof res === 'object' && ('ok' in res || 'status' in res)) {
            if (res.ok === false) throw new Error(`HTTP error ${res.status}`);
            user = res.body || res.data;
        } else {
            user = res;
        }

        if (!user) {
            alert("Usuario no encontrado");
            return;
        }
        // Llenar campos
            inputNombre.value = user.nombre;
            inputEmail.value = user.email;
            inputTelefono.value = user.telefono ?? "";

            // Mostrar nombre arriba
            if (userNameDisplay) {
                userNameDisplay.textContent = user.nombre;
            }

        } catch (error) {
            console.error("Error al cargar usuario:", error);
            alert("No se pudo cargar la información.");
        }
    }
    // Guardar cambios
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const email = inputEmail.value.trim();
        const telefono = inputTelefono.value.trim();

        if (!nombre || !email) {
            alert("Por favor completa nombre y email.");
            return;
        }
        try {
            const res = await window.http.put(
                `http://localhost:3001/update-user/${userId}`,
                { nombre, email, telefono }
            );
            const body = res.body ?? res.data ?? res;

            if (!res.ok) {
                alert(`Error: ${body.error || "No se pudo actualizar"}`);
                return;
            }

            alert("Usuario actualizado correctamente");
            await window.appNav.toAdminPanel(); // 👈 regresar al panel admin

        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Ocurrió un error al actualizar.");
        }
    });

    //Botón: Volver al admin
    backBtn.addEventListener("click", async () => {
        await window.appNav.toAdminPanel();
    });

    // Cargar inicialmente
    cargarUsuario();
});
