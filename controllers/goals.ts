/******************
 * GOALS CONTROLLER
 */
 import { MongoDecompressionError, ObjectId } from 'mongodb';
 const mongodb = require('../db/connect');
 
 // filler data for testing
 const fillerGoals = [
    {
        name: 'Second Goal',
        _id: "new ObjectId(1)",
        createdDate: new Date(),
        dueDate: new Date(), 
        deletedDate: new Date(),
        entry_ids: [
           "new ObjectId(9)",
           "new ObjectId(0)",
        ],
        goal_ids:  [
           "new ObjectId(9)",
           "new ObjectId(0)",
        ],
    },
     {
         _id: "new ObjectId(8)",
         name: 'Second Goal',
         createdDate: new Date(),
         dueDate: new Date(), 
         deletedDate: new Date(),
         entry_ids: [
            "new ObjectId(9)",
            "new ObjectId(0)",
         ],
         goal_ids:  [
            "new ObjectId(9)",
            "new ObjectId(0)",
         ],
     }
 ];
 
 
 // GET /goals
 const getAllGoals = async (req: any, res: any) => {
     // return test data
     try {
         res.setHeader('Content-Type', 'application/json')
         const goals = await mongodb.getDb().db().collection('goals').find().toArray();
         res.status(200).send(JSON.stringify(goals));
     }
     catch (err) {
         res.status(500).send(err);
     }
 };
 
 
 // GET /goals/:id
 const getGoal = async (req: any, res: any) => {
     // return test data
     try {
        res.setHeader('Content-Type', 'application/json');
        const goalId = new ObjectId(req.params.id);

        if (!goalId) {
            res.status(400).send('No goal ID provided');
            return;
        }
    
        if (!ObjectId.isValid(goalId)) {
            res.status(400).send('Invalid goal ID');
            return;
        }

        const goal = await mongodb.getDb().db().collection('goal').find(goalId).toArray();

        // return 404 if goal not found
        if (!goal) {
            res.status(404).send('Goal not found');
            return;
        }

        res.status(200).send(JSON.stringify(goal));
     }
     catch (err) {
         res.status(500).send(err);
     }
 };
 
 
 // POST /goals
 const addGoal = async (req: any, res: any) => {
     // add the goal to test data
     try {
         res.setHeader('Content-Type', 'application/json')
         let newGoal = {
            
                _id: "new ObjectId(8)",
                name: 'Second Goal',
                createdDate: new Date(),
                dueDate: new Date(), 
                deletedDate: new Date(),
                entry_ids: [
                   "new ObjectId(9)",
                   "new ObjectId(0)",
                ],
                goal_ids:  [
                   "new ObjectId(9)",
                   "new ObjectId(0)",
                ],
            
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
                 goal.entry_ids.push(entry);
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
         const goalId = req.params.id;
         const goal = await mongodb.getDb().db().collection('goals').findOne({_id:goalId});
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


 export { getAllGoals, getGoal, addGoal, updateGoal, deleteGoal };