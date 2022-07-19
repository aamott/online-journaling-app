"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.updateGoal = exports.addGoal = exports.getGoal = exports.getAllGoals = void 0;
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
const mongodb_1 = require("mongodb");
// GET /goals
const getAllGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        const mongodb = res.locals.mongodb;
        const goals = mongodb.getDb().db().collection('goals').find({ owner_id: user.sub });
        const goalsArray = yield goals.toArray();
        res.status(200).send(JSON.stringify(goalsArray));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.getAllGoals = getAllGoals;
// GET /goals/:id
const getGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;
        if (!mongodb_1.ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid id'));
            return;
        }
        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = yield goalsCollection.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
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
});
exports.getGoal = getGoal;
// POST /goals
const addGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // add the goal to test data
    try {
        res.setHeader('Content-Type', 'application/json');
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
            media_ids: [],
        };
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const result = yield goalsCollection.insertOne(new_goal);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.addGoal = addGoal;
// PUT /goals/:id
const updateGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // update the goal in test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;
        if (!mongodb_1.ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid goal id'));
            return;
        }
        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = yield goalsCollection.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
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
        const result = yield goalsCollection.updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: goal });
        res.status(200).send(JSON.stringify(result.modifiedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.updateGoal = updateGoal;
// DELETE /users/:id
const deleteGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // delete the goal from test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;
        if (!mongodb_1.ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid goal id'));
            return;
        }
        const goalId = new mongodb_1.ObjectId(req.params.id);
        const mongodb = res.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = yield goalsCollection.findOne({ _id: goalId });
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
        const result = yield mongodb.getDb().db().collection('goals').deleteOne({ _id: goalId });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.deleteGoal = deleteGoal;
