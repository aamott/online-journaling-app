/******************
 * GOALS CONTROLLER
 */
 import { ObjectId } from 'mongodb';
 const mongodb = require('../db/connect');
 
 // filler data for testing
 const fillerGoals = [
     {
         _id: new ObjectId(1),
         name: 'First Goal',
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
         name: 'Second Goal',
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
 
 
 // GET /goals
 const getAllGoals = async (req: any, res: any) => {
     // return test data
     try {
         res.setHeader('Content-Type', 'application/json')
         res.status(200).send(JSON.stringify(fillerGoals));
     }
     catch (err) {
         res.status(500).send(err);
     }
 };
 
 
 // GET /goals/:id
 const getGoals = async (req: any, res: any) => {
     // return test data
     try {
         res.setHeader('Content-Type', 'application/json')
         res.status(200).send(JSON.stringify(fillerGoals[0]));
     }
     catch (err) {
         res.status(500).send(err);
     }
 };
 
 
 // POST /users
 const addGoal = async (req: any, res: any) => {
     // add the goal to test data
     try {
         res.setHeader('Content-Type', 'application/json')
         let newGoal = {
             _id: new ObjectId(),
             name: req.body.name,
             entry_ids: [],
             goal_ids: [],
             media_ids: []
         }
         fillerGoals.push(newGoal);
         res.status(200).send(JSON.stringify(newGoal._id));
     }
     catch (err) {
         res.status(500).send(err);
     }
 };
 
 
 // PUT /goals/:id
 const updateGoal = async (req: any, res: any) => {
     // update the goal in test data
     try {
         res.setHeader('Content-Type', 'application/json')
         let goal = fillerGoals.find( (goal) => goal._id.toString() === req.params.id);
         
         // return 404 if user not found
         if (!goal) {
             res.status(404).send('User not found');
             return;
         }
 
         goal.name = req.body.name || goal.name;
         
 
         // Loop through goals. If an entry doesn't exist in the user's goals, add it.
         for (let entry of req.body.goal_ids) {
             if (!req.body.goal_ids.find((entry_id: { _id: ObjectId; }) => entry_id._id.toString() === entry._id.toString())) {
                 goal.goal_ids.push(entry);
             }
         }
 
         res.status(200).send(JSON.stringify(goal));
     }
     catch (err) {
         res.status(500).send(err);
     }
 };
 
 
 // DELETE /users/:id
 const deleteGoal = async (req: any, res: any) => {
     // delete the goal from test data
     try {
         res.setHeader('Content-Type', 'application/json')
         let goal = fillerGoals.find( (goal) => goal._id.toString() === req.params.id);
         
         // return 404 if goal not found
         if (!goal) {
             res.status(404).send('Goal not found');
             return;
         }
 
         let index = fillerGoals.indexOf(goal);
         fillerGoals.splice(index, 1);
         res.status(200).send(JSON.stringify(1)); // return number of users deleted
     }
     catch (err) {
         res.status(500).send(err);
     }
 };