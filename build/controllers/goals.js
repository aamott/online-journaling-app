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
 */
const mongodb_1 = require("mongodb");
// GET /goals
const getAllGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goals = yield goalsCollection.find({}).toArray();
        res.status(200).send(JSON.stringify(goals));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getAllGoals = getAllGoals;
// GET /goals/:id
const getGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = yield goalsCollection.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        res.status(200).send(JSON.stringify(goal));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getGoal = getGoal;
// POST /users
const addGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // add the goal to test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        let new_goal = {
            name: 'Second Goal',
            createdDate: new Date(),
            dueDate: new Date(),
            deletedDate: null,
            entry_ids: [],
            media_ids: [],
        };
        const result = yield goalsCollection.insertOne(new_goal);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.addGoal = addGoal;
// PUT /goals/:id
const updateGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // update the goal in test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        const goalsCollection = mongodb.getDb().db().collection('goals');
        const goal = yield goalsCollection.findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
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
        const result = yield goalsCollection.updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, goal);
        res.status(200).send(JSON.stringify(result.modifiedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.updateGoal = updateGoal;
// DELETE /users/:id
const deleteGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // delete the goal from test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const goalId = req.params.id;
        const goal = yield mongodb.getDb().db().collection('goals').findOne({ _id: goalId });
        // return 404 if goal not found
        if (!goal) {
            res.status(404).send('Goal not found');
            return;
        }
        const result = yield mongodb.getDb().db().collection('goals').deleteOne({ _id: goalId });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.deleteGoal = deleteGoal;
