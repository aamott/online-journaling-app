/******************
 * GOALS CONTROLLER
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
                 _id: new ObjectId(2),
                 createdDate: new Date(),
                 title: 'My first entry',
             },
             {
                 _id: new ObjectId(3),
                 createdDate: new Date(),
                 title: 'My second entry',
             }
         ],
         goal_ids: [
             {
                 _id: new ObjectId(4),
             },
             {
                 _id: new ObjectId(5),
             }
         ],
         media_ids: [
             {
                 _id: new ObjectId(6),
                 addedDate: new Date()
             },
             {
                 _id: new ObjectId(7),
                 addedDate: new Date()
             }
         ]
     },
     {
         _id: new ObjectId(8),
         name: 'Jane Doe',
         entry_ids: [
             {
                 _id: new ObjectId(9),
                 createdDate: new Date(),
                 title: 'My first entry',
             },
             {
                 _id: new ObjectId(0),
                 createdDate: new Date(),
                 title: 'My second entry',
             }
         ],
         goal_ids: [
             {
                 _id: new ObjectId(4),
             },
             {
                 _id: new ObjectId(5),
             }
         ],
         media_ids: [
             {
                 _id: new ObjectId(33),
                 addedDate: new Date()
             },
             {
                 _id: new ObjectId(6),
                 addedDate: new Date()
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
         res.status(200).send(JSON.stringify(fillerUsers[0]));
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
         let user = fillerUsers.find( (user) => user._id.toString() === req.params.id);
         
         // return 404 if user not found
         if (!user) {
             res.status(404).send('User not found');
             return;
         }
 
         user.name = req.body.name || user.name;
         
         // Loop through entries. If an entry doesn't exist in the user's entries, add it.
         for (let entry of req.body.entry_ids) {
             if (!user.entry_ids.find( (entry_id: { _id: ObjectId ; }) => entry_id._id.toString() === entry._id.toString())) {
                 user.entry_ids.push(entry);
             }
         }
 
         // Loop through media. If an entry doesn't exist in the user's media, add it.
         for (let entry of req.body.media_ids) {
             if (!user.media_ids.find((entry_id: { _id: ObjectId; }) => entry_id._id.toString() === entry._id.toString())) {
                 user.media_ids.push(entry);
             }
         }
 
         // Loop through goals. If an entry doesn't exist in the user's goals, add it.
         for (let entry of req.body.goal_ids) {
             if (!user.goal_ids.find((entry_id: { _id: ObjectId; }) => entry_id._id.toString() === entry._id.toString())) {
                 user.goal_ids.push(entry);
             }
         }
 
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