/******************
 * GOALS CONTROLLER
 * 
 * Goals database looks like this:
 * {
 *      _id: ObjectId,
 *      owner_id: String,
 *      description: String,
 *      createdDate: Date,
 *      dueDate: Date,
 *      deletedDate: Date,
 *      entry_ids: [ObjectId],
 *      media_ids: [ObjectId],
 * }
 */
 import { ObjectId } from 'mongodb';

 // GET /goals
const getAllGoals = async (req: any, res: any) => {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json')

        const user_id = req.locals.user_id;

        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goals = await goalsCollection.find({ owner_id: user_id }).toArray();
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
        
        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = await goalsCollection.findOne({ _id: new ObjectId(req.params.id) });

        // return 403 if user is not the owner of the goal
        if (goal.owner_id !== req.locals.user_id) {
            res.status(403).send('Forbidden');
            return;
        }

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
 
 
 // POST /users
const addGoal = async (req: any, res: any) => {
    // add the goal to test data
    try {
        res.setHeader('Content-Type', 'application/json')

        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        
        let new_goal = {
            owner_id: req.locals.user_id,
            description: req.body.description,
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
        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = await goalsCollection.findOne({ _id: new ObjectId(req.params.id) });

        // return 403 if user is not the owner of the goal
        if (goal.owner_id !== req.locals.user_id) {
            res.status(403).send('Forbidden');
            return;
        }
         
        // return 404 if goal not found
        if (!goal) {
            res.status(404).send('Goal not found');
            return;
        }

        goal.description = req.body.description || goal.description;
        goal.dueDate = req.body.dueDate || goal.dueDate;
        // if a goal is updated, it's deletedDate is set to null
        goal.deletedDate = null;
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

        // return 403 if user is not the owner of the goal
        if (goal.owner_id !== req.locals.user_id) {
            res.status(403).send('Forbidden');
            return;
        }

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