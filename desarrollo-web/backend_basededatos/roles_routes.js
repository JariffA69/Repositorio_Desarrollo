import { RolModel } from '../models/roles.js';

export class RolRoute {

    constructor(app){
        this.app = app;
    };

    initRolesRoutes() {
        
        this.app.get('/get-roles', async (request, response) => {
        console.log('GET roles');
        try {
            // Obtenemos todos los roles disponibles
            const roles = await RolModel.findAll({
                attributes: ['id_rol', 'nombre']
            });
            response.json(roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
        });

        this.app.get('/get-rol/:id', async (request, response) => {
            console.log('get rol by id');
            const rolId = request.params.id;
            try {
                const rol = await RolModel.findByPk(rolId);
                if (rol) {
                    response.json(post);
                } else {
                    response.status(404).json({ error: 'Rol not found' });
                }
            } catch (error) {
                console.error('Error fetching rol:', error);
                response.status(500).json({ error: 'Internal Server Error' });
            }
        });

        this.app.post('/create-rol', async (request, response) => {
            console.log('create rol', request.body);
            const { id_rol, nombre } = request.body;
            console.log('Data from server:', id_rol, nombre);
            try {
                const newPost = await RolModel.create({ id_rol, nombre });
                response.status(201).json(newPost);
            } catch (error) {
                console.error('Error creating post:', error);
                response.status(500).json({ error: 'Internal Server Error' });
            }
        });

        this.app.put('/update-rol/:id', async (request, response) => {
            console.log('update rol');
            const rolId = request.params.id;
            const { id_rol, nombre } = request.body; 
            try {
                const rol = await RolModel.findByPk(rolId); 
                if (rol) {
                    rol.id_rol = id_rol;
                    rol.nombre = nombre;
                    await rol.save();
                    response.json(rol);
                } else {
                    response.status(404).json({ error: 'rol not found' });
                }
            } catch (error) {
                console.error('Error updating rol:', error);
                response.status(500).json({ error: 'Internal Server Error' });
            }
        });
    };
}
