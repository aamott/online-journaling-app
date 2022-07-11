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
        media_ids: [
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
        media_ids: [
            "new ObjectId(9)",
            "new ObjectId(0)",
        ],
    }
];
// GET /goals
const getAllGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(fillerGoals));
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
        res.status(200).send(JSON.stringify(fillerGoals[0]));
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
            media_ids: [
                "new ObjectId(9)",
                "new ObjectId(0)",
            ],
        };
        fillerGoals.push(newGoal);
        res.status(200).send(JSON.stringify(newGoal._id));
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
        let goal = fillerGoals.find((goal) => goal._id.toString() === req.params.id);
        // return 404 if user not found
        if (!goal) {
            res.status(404).send('User not found');
            return;
        }
        goal.name = req.body.name || goal.name;
        // Loop through goals. If an entry doesn't exist in the user's goals, add it.
        for (let entry of req.body.goal_ids) {
            if (!req.body.goal_ids.find((entry_id) => entry_id._id.toString() === entry._id.toString())) {
                goal.entry_ids.push(entry);
            }
        }
        res.status(200).send(JSON.stringify(goal));
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
        let goal = fillerGoals.find((goal) => goal._id.toString() === req.params.id);
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
});
exports.deleteGoal = deleteGoal;
