import {DataTypes, Model} from "sequelize";
import {DatabaseConfig} from '../config/database.config.js';
import { PostModel } from './post.js';

export class UserModel extends Model {}

UserModel.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        
    },
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'id_rol',
        references: {
            model: 'roles',
            key: 'id_rol'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: true,
        
    },
    //apellido: {
        //type: DataTypes.STRING(150),
        //allowNull: true,
    //},
    email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: { msg: 'Email already in use' },
        validate: {
            isEmail: { msg: 'Must be a valid email address' }
        }
        
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {args: [8, 250], msg: 'Password must be at least 8 characters long'}
        }
        
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: 'telefono',
        validate: {
            isNumeric: { msg: 'Teléfono solo puede contener números' },
            len: { args: [7,15], msg: 'Teléfono debe tener entre 7 y 15 dígitos' }
        }
    }
},{
sequelize: DatabaseConfig, // <- Usa la instancia de Sequelize
modelName: 'User',
tableName: 'usuarios',
timestamps: false,
});

//UserModel.hasMany(PostModel, { 
    //foreignKey: 'user_id', as: 'Posts'});

//PostModel.belongsTo(UserModel, { 
    //foreignKey: 'user_id', as: 'User'}); 


