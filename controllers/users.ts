/******************
 * USERS CONTROLLER
 */
import { ObjectId } from 'mongodb';
const mongodb = require('../db/connect');

// filler data for testing
const fillerUsers = [
    {
        _id: new ObjectId(1),
        name: 'John Doe',
        entry_ids: [
            {
                _id: new ObjectId(1),
                date_created: new Date(),
                title: 'My first entry',
            },
            {
                _id: new ObjectId(2),
                date_created: new Date(),
                title: 'My second entry',
            }
        ],
        goal_ids: [
            {
                _id: new ObjectId(1),
            },
            {
                _id: new ObjectId(2),
            }
        ],
        media_ids: [
            {
                _id: new ObjectId(1),
                date_added: new Date()
            },
            {
                _id: new ObjectId(2),
                date_added: new Date()
            }
        ]
    },
    {
        _id: new ObjectId(2),
        name: 'Jane Doe',
        entry_ids: [
            {
                _id: new ObjectId(3),
                date_created: new Date(),
                title: 'My first entry',
            },
            {
                _id: new ObjectId(4),
                date_created: new Date(),
                title: 'My second entry',
            }
        ],
        goal_ids: [
            {
                _id: new ObjectId(3),
            },
            {
                _id: new ObjectId(4),
            }
        ],
        media_ids: [
            {
                _id: new ObjectId(3),
                date_added: new Date()
            },
            {
                _id: new ObjectId(4),
                date_added: new Date()
            }
        ]
    }
];


// GET /users
const getAllUsers = async (req: any, res: any) => {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(JSON.stringify(fillerUsers));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// GET /users/:id
const getUser = async (req: any, res: any) => {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json')
        let user = fillerUsers.find( (user) => user._id.toString() === req.params.id);
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
        let newUser = {
            _id: new ObjectId(),
            name: req.body.name,
            entry_ids: [],
            goal_ids: [],
            media_ids: []
        }
        fillerUsers.push(newUser);
        res.status(200).send(JSON.stringify(newUser._id));
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
        let user = fillerUsers.find((user) => user._id.toString() === req.params.id);
        
        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        user.name = req.body.name || user.name;

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
        let user = fillerUsers.find( (user) => user._id.toString() === req.params.id);
        
        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        let index = fillerUsers.indexOf(user);
        fillerUsers.splice(index, 1);
        res.status(200).send(JSON.stringify(1)); // return number of users deleted
    }
    catch (err) {
        res.status(500).send(err);
    }
};


export { getAllUsers, getUser, addUser, updateUser, deleteUser };