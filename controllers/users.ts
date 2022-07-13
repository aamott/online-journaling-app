/******************
 * USERS CONTROLLER
 */
import { ObjectId } from 'mongodb';

// // filler data for testing
// const fillerUsers = [
//     {
//         _id: new ObjectId(1),
//         name: 'John Doe',
//         entry_ids: [
//             {
//                 _id: new ObjectId(1),
//                 date_created: new Date(),
//                 title: 'My first entry',
//             },
//             {
//                 _id: new ObjectId(2),
//                 date_created: new Date(),
//                 title: 'My second entry',
//             }
//         ],
//         goal_ids: [
//             {
//                 _id: new ObjectId(1),
//             },
//             {
//                 _id: new ObjectId(2),
//             }
//         ],
//         media_ids: [
//             {
//                 _id: new ObjectId(1),
//                 date_added: new Date()
//             },
//             {
//                 _id: new ObjectId(2),
//                 date_added: new Date()
//             }
//         ]
//     },
//     {
//         _id: new ObjectId(2),
//         name: 'Jane Doe',
//         entry_ids: [
//             {
//                 _id: new ObjectId(3),
//                 date_created: new Date(),
//                 title: 'My first entry',
//             },
//             {
//                 _id: new ObjectId(4),
//                 date_created: new Date(),
//                 title: 'My second entry',
//             }
//         ],
//         goal_ids: [
//             {
//                 _id: new ObjectId(3),
//             },
//             {
//                 _id: new ObjectId(4),
//             }
//         ],
//         media_ids: [
//             {
//                 _id: new ObjectId(3),
//                 date_added: new Date()
//             },
//             {
//                 _id: new ObjectId(4),
//                 date_added: new Date()
//             }
//         ]
//     }
// ];


// GET /users
const getAllUsers = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json')
        // fetch the users from mongodb
        const mongodb = req.locals.mongodb;
        const users = await mongodb.getDb().db().collection('users').find().toArray();
        
        res.status(200).send(JSON.stringify(users));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// GET /users/:id
const getUser = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json')
        // fetch the user from mongodb
        const mongodb = req.locals.mongodb;
        const user_id = new ObjectId(req.params.id);
        const user = await mongodb.getDb().db().collection('users').findOne({ _id: user_id });
        res.status(200).send(JSON.stringify(user));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// POST /users
const addUser = async (req: any, res: any) => {

    // add the user to test data
    try {
        res.setHeader('Content-Type', 'application/json')

        const mongodb = req.locals.mongodb;

        let newUser = {
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
        res.status(500).send(err);
    }
};


// PUT /users/:id
const updateUser = async (req: any, res: any) => {

    // update the user in test data
    try {
        res.setHeader('Content-Type', 'application/json')
        // get the user from mongodb
        const mongodb = req.locals.mongodb;
        const user_id = new ObjectId(req.params.id);
        const user = await mongodb.getDb().db().collection('users').findOne({ _id: user_id });
        
        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // update the user
        user.name = req.body.name;
        user.username = req.body.username;

        res.status(200).send(JSON.stringify(user));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// DELETE /users/:id
const deleteUser = async (req: any, res: any) => {
    
    // delete the user from test data
    try {
        res.setHeader('Content-Type', 'application/json')
        // get the user from mongodb
        const mongodb = req.locals.mongodb;
        const user_id = new ObjectId(req.params.id);
        const user = await mongodb.getDb().db().collection('users').findOne({ _id: user_id });

        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // delete the user
        const result = await mongodb.getDb().db().collection('users').deleteOne({ _id: user_id });
        res.status(200).send(JSON.stringify(result));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


export { getAllUsers, getUser, addUser, updateUser, deleteUser };