import { UserModel } from '../models/users.js';
import { RolModel } from '../models/roles.js';
import {generateJwtToken, validateToken} from '../app/middleware/accessToken.middleware.js';

export class UserRoute {

    constructor(app){
        this.app = app;
    };

    initUserRoutes(){
        this.app.post('/user-login', async (request, response) => {
            console.log('POST /user-login headers:', request.headers);
            console.log('POST /user-login body:', request.body);
            const { email, password } = request.body;
            
            if (!email || !password) {
                return response.status(400).json({ ok: false, error: 'Email y password son requeridos' });
            }

            try {
                const user = await UserModel.findOne(
                    {
                        attributes: ['id_usuario', 'id_rol', 'nombre', 'email','password','telefono'],
                        include: [{ model: RolModel, as: 'Rol' }],
                        where: { email: email, password:password }
                    }
                );
                console.log('Fetched user:', user);
                if (user) {
                    const token = generateJwtToken(user);
                    response.json({ ok: true, token: token });
                } else {
                    response.status(401).json({error: 'Invalid email or password' });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                response.status(500).json({error: 'Internal Server Error'});
            }
        });

        this.app.get('/get-users', validateToken, async (request, response) => {
            console.log('get users');
        try {
            const users = await UserModel.findAll({
                include: [{ model: RolModel, as: 'Rol' }]});
            response.json(users);
        }catch (error) {
            console.error('Error fetching users:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    });

    this.app.get('/get-user/:id', async (request, response) => {
        console.log('get user by id');
        const userId = request.params.id;
        try {
            const user = await UserModel.findOne({include: [{ model: RolModel, as: 'Rol' }], where: { id_usuario: userId }});
            if (user) {
                response.json(user);
            } else {
                response.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    });

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
        // Devolvemos 500 si hay un problema en la DB
        response.status(500).json({ error: 'Internal Server Error' });
    }
    });

    this.app.post('/create-user', async (request, response) => {
            console.log('create user', request.body);
            const { id_rol, nombre, email, password, telefono } = request.body;
            console.log('Data from server:', id_rol, nombre, email, password, telefono);
            try {
                const newUser = await UserModel.create({ id_rol, nombre, email, password, telefono });
                response.status(201).json(newUser);
            } catch (error) {
                console.error('Error creating user:', error);
                response.status(500).json({ error: 'Internal Server Error' });
            }
    });
    this.app.put('/update-user/:id', async (request, response) => {
            console.log('update user');
            const userId = request.params.id;
            const {nombre,email,telefono } = request.body;
            try {
                const user = await UserModel.findByPk(userId);
                if (user) {
                    user.nombre = nombre;
                    user.email = email;
                    user.telefono = telefono;
                    await user.save();
                    response.json(user);
                } else {
                    response.status(404).json({ error: 'User not found' });
                }
            } catch (error) {
                console.error('Error updating user:', error);
                response.status(500).json({ error: 'Internal Server Error' });
            }
        });   
    this.app.delete('/delete-user/:id', validateToken, async (request, response) => {
        console.log('DELETE user', request.params.id);
        const userId = request.params.id;
        try {
            const rowsDeleted = await UserModel.destroy({ 
                where: { id_usuario: userId } 
            });
            
            if (rowsDeleted > 0) {
                response.json({ message: 'User deleted successfully' });
            } else {
                response.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    });
    }
}
