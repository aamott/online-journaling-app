/******************
 * USERS CONTROLLER
 */
import { ObjectId } from 'mongodb';
// GET /users
// const getAllUsers = async (req: any, res: any) => {
//     try {
//         res.setHeader('Content-Type', 'application/json')
//         // fetch the users from mongodb
//         const mongodb = res.locals.mongodb;
//         const users = await mongodb.getDb().db().collection('users').find().toArray();
        
//         res.status(200).send(JSON.stringify(users));
//     }
//     catch (err) {
//         res.status(500).send("Internal server error");
//     }
// };


// GET /users/:id
const getUser = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json')
        // fetch the user from mongodb
        const mongodb = res.locals.mongodb;
        const user_id = res.oidc.user.sub;
        const user = await mongodb.getDb().db().collection('users').findOne({ sub: user_id });

        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        res.status(200).send(JSON.stringify(user));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// GET /users/active
const getActiveUser = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json')
        const user = req.oidc.user;

        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;

        // fetch the user from mongodb
        const mongodb = res.locals.mongodb;
        const userData = await mongodb.getDb().db().collection('users').findOne({ sub: user.id });

        // return 404 if user not found
        if (!userData) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        res.status(200).send(JSON.stringify(userData));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
}


// POST /users
const addUser = async (req: any, res: any) => {

    // add the user to test data
    try {
        res.setHeader('Content-Type', 'application/json')

        const mongodb = res.locals.mongodb;

        let newUser = {
            sub: req.oidc.user.sub,
            name: req.body.name,
            username: req.body.username,
            entry_ids: [],
            goal_ids: [],
            media_ids: []
        }
        const result = await mongodb.getDb().db().collection('users').insertOne(newUser);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// PUT /users/:id
const updateUser = async (req: any, res: any) => {

    // update the user in test data
    try {
        res.setHeader('Content-Type', 'application/json')
        // get the user from mongodb
        const mongodb = res.locals.mongodb;
        const user_id = res.oidc.user.sub;
        const user = await mongodb.getDb().db().collection('users').findOne({ sub: user_id });
        
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }

        // update the user
        user.name = req.params.name;
        user.username = req.params.username;
        const result = await mongodb.getDb().db().collection('users').updateOne({ sub: user_id }, user);
        res.status(200).send(JSON.stringify(result));

        res.status(200).send(JSON.stringify(result.modifiedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// DELETE /users/:id
const deleteUser = async (req: any, res: any) => {
    
    // delete the user from test data
    try {
        res.setHeader('Content-Type', 'application/json')
        // get the user from mongodb
        const mongodb = res.locals.mongodb;
        const user_id = new ObjectId(req.params.id);
        const user = await mongodb.getDb().db().collection('users').findOne({ _id: user_id });

        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }

        // delete the user
        const result = await mongodb.getDb().db().collection('users').deleteOne({ _id: user_id });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


const loginCallback = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json')
        const user = req.oidc.user;

        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;

        // fetch the user from mongodb
        const mongodb = res.locals.mongodb;
        const userData = await mongodb.getDb().db().collection('users').findOne({ sub: user.sub });

        // if the user is not found, create a new user
        if (!userData) {
            const newUser = {
                _id: new ObjectId(),
                sub: user.sub,
                name: user.name,
                entry_ids: [],
                goal_ids: [],
                media_ids: []
            };
            await mongodb.getDb().db().collection('users').insertOne(newUser);
        }

        // redirect to the home page
        res.redirect('http://localhost:8080/home.html');
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
}

export { getActiveUser, getUser, addUser, updateUser, deleteUser, loginCallback };