import { UserModel } from '../models/users.js';
import { PostModel } from '../models/post.js';

export class RelationshipConfig {

    initRelationships() {

        UserModel.hasMany(PostModel, { 
            foreignKey: 'user_id' });
        PostModel.belongsTo(UserModel, { 
            foreignKey: 'id'});
    }

}

await UserModel.sync();
await PostModel.sync();