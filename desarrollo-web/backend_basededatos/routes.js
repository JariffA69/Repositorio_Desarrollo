import { UserModel } from '../models/users.js';
import { PostModel } from '../models/post.js';
import {generateJwtToken, validateToken} from '../app/middleware/accessToken.middleware.js';

export class UserRoute {

    constructor(app){
        this.app = app;
    };

    initUserRoutes(){
        this.app.post('/user-login', async (request, response) => {
            console.log('POST /user-login headers:', request.headers);
            console.log('POST /user-login body:', request.body); // <-- ver qué llega
            const { email, password } = request.body;
            //console.log('get users');

            if (!email || !password) {
                return response.status(400).json({ ok: false, error: 'Email y password son requeridos' });
            }

            try {
                const user = await UserModel.findOne(
                    {
                        attributes: ['id_usuario', 'nombre', 'email','password','telefono'],
                        include: [{ model: PostModel }],
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
                include: [{ model: PostModel }]});
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
            const user = await UserModel.findOne({include: [{ model: PostModel, as: 'Posts' }], where: { id: userId }});
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

    this.app.post('/create-user', async (request, response) => {
        console.log('create user', request.body);
        const { id_rol, nombre, email, password, telefono } = request.body;
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
        const { nombre, apellido, email, password, telefono } = request.body;
        try {
            const user = await UserModel.findByPk(userId); 
            if (user) {
                user.nombre = nombre;
                user.apellido = apellido;
                user.email = email;
                user.password = password;
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
    }
}

