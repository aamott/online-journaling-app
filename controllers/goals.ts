/******************
 * GOALS CONTROLLER
 */
 import { ObjectId } from 'mongodb';

 // GET /goals
const getAllGoals = async (req: any, res: any) => {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json')

        const mongodb = req.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goals = await goalsCollection.find({}).toArray();
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
        res.setHeader('Content-Type', 'application/json')
        
        const mongodb = req.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = await goalsCollection.findOne({ _id: new ObjectId(req.params.id) });
        res.status(200).send(JSON.stringify(goal));
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

        const mongodb = req.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        
        let new_goal = {
            name: 'Second Goal',
            createdDate: new Date(),
            dueDate: new Date(), 
            deletedDate: null,
            entry_ids: [],
            media_ids:  [],
        }
        const result = await goalsCollection.insertOne(new_goal);
        res.status(200).send(JSON.stringify(result.insertedId));
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
        const mongodb = req.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = await goalsCollection.findOne({ _id: new ObjectId(req.params.id) });
         
        // return 404 if user not found
        if (!goal) {
            res.status(404).send('User not found');
            return;
        }

        goal.name = req.body.name || goal.name;
        goal.dueDate = req.body.dueDate || goal.dueDate;
        // if the user sets deletedDate to null, it will be deleted, but if the user doesn't set it, it will be left alone
        if (req.body.deletedDate) {
            goal.deletedDate = req.body.deletedDate;
        }
        goal.entry_ids = req.body.entry_ids || goal.entry_ids;
        goal.media_ids = req.body.media_ids || goal.media_ids;

        const result = await goalsCollection.updateOne({ _id: new ObjectId(req.params.id) }, goal);
        res.status(200).send(JSON.stringify(result.modifiedCount));
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

        const result = await mongodb.getDb().db().collection('goals').deleteOne({_id:goalId});
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


export { getAllGoals, getGoal, addGoal, updateGoal, deleteGoal };