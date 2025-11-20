import {DataTypes, Model} from 'sequelize';
import {DatabaseConfig} from '../config/database.config.js';

export class PostModel extends Model {}

PostModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER
        
    },
    comment: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.STRING(250),
        allowNull: true,
        
    },
    
},{
sequelize: DatabaseConfig, // <- Usa la instancia de Sequelize
modelName: 'Post',
tableName: 'posts',
timestamps: false,
});
