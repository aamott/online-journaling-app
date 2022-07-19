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

        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }

        const mongodb = res.locals.mongodb;
        const goals = mongodb.getDb().db().collection('goals').find({ owner_id: user.sub });
        if (!goals) {
            res.status(404).send(JSON.stringify('Goals not found'));
        }
        const goalsArray = await goals.toArray();
        res.status(200).send(JSON.stringify(goalsArray));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};
 
 
 // GET /goals/:id
const getGoal = async (req: any, res: any) => {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json')
        
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;

        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid id'));
            return;
        }

        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = await goalsCollection.findOne({ _id: new ObjectId(req.params.id) });

        // return 403 if user is not the owner of the goal
        if (goal.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('Forbidden'));
            return;
        }

        // return 404 if goal not found
        if (!goal) {
            res.status(404).send(JSON.stringify('Goal not found'));
            return;
        }

        res.status(200).send(JSON.stringify(goal));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};
 
 
 // POST /goals
const addGoal = async (req: any, res: any) => {
    // add the goal to test data
    try {
        res.setHeader('Content-Type', 'application/json')

        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;

        const mongodb = res.locals.mongodb;
        
        let new_goal = {
            owner_id: user.sub,
            description: req.body.description,
            createdDate: new Date(),
            dueDate: new Date(), 
            deletedDate: null,
            entry_ids: [],
            media_ids:  [],
        }
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const result = await goalsCollection.insertOne(new_goal);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};
 
 
// PUT /goals/:id
const updateGoal = async (req: any, res: any) => {
    // update the goal in test data
    try {
        res.setHeader('Content-Type', 'application/json')

        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;

        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid goal id'));
            return;
        }

        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = await goalsCollection.findOne({ _id: new ObjectId(req.params.id) });

        // return 403 if user is not the owner of the goal
        if (goal.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('Forbidden'));
            return;
        }
         
        // return 404 if goal not found
        if (!goal) {
            res.status(404).send(JSON.stringify('Goal not found'));
            return;
        }

        goal.description = req.body.description || goal.description;
        goal.dueDate = req.body.dueDate || goal.dueDate;
        // if a goal is updated, it's deletedDate is set to null
        goal.deletedDate = null;
        goal.entry_ids = req.body.entry_ids || goal.entry_ids;
        goal.media_ids = req.body.media_ids || goal.media_ids;

        const result = await goalsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: goal });
        res.status(200).send(JSON.stringify(result.modifiedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};
 
 
// DELETE /users/:id
const deleteGoal = async (req: any, res: any) => {
    // delete the goal from test data
    try {
        res.setHeader('Content-Type', 'application/json')

        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;

        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid goal id'));
            return;
        }

        const goalId = new ObjectId(req.params.id);
        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = await goalsCollection.findOne({ _id: goalId });

        // return 404 if goal not found
        if (!goal) {
            res.status(404).send(JSON.stringify('Goal not found'));
            return;
        }
        
        // return 403 if user is not the owner of the goal
        if (goal.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('Forbidden'));
            return;
        }

        const result = await mongodb.getDb().db().collection('goals').deleteOne({_id:goalId});
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


export { getAllGoals, getGoal, addGoal, updateGoal, deleteGoal };