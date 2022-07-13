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
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = exports.getAllUsers = void 0;
/******************
 * USERS CONTROLLER
 */
const mongodb_1 = require("mongodb");
// GET /users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Content-Type', 'application/json');
        // fetch the users from mongodb
        const mongodb = req.locals.mongodb;
        const users = yield mongodb.getDb().db().collection('users').find().toArray();
        res.status(200).send(JSON.stringify(users));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getAllUsers = getAllUsers;
// GET /users/:id
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Content-Type', 'application/json');
        // fetch the user from mongodb
        const mongodb = req.locals.mongodb;
        const user_id = new mongodb_1.ObjectId(req.params.id);
        const user = yield mongodb.getDb().db().collection('users').findOne({ _id: user_id });
        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.status(200).send(JSON.stringify(user));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getUser = getUser;
// POST /users
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // add the user to test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        let newUser = {
            name: req.body.name,
            username: req.body.username,
            entry_ids: [],
            goal_ids: [],
            media_ids: []
        };
        const result = yield mongodb.getDb().db().collection('users').insertOne(newUser);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.addUser = addUser;
// PUT /users/:id
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // update the user in test data
    try {
        res.setHeader('Content-Type', 'application/json');
        // get the user from mongodb
        const mongodb = req.locals.mongodb;
        const user_id = new mongodb_1.ObjectId(req.params.id);
        const user = yield mongodb.getDb().db().collection('users').findOne({ _id: user_id });
        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        // update the user
        user.name = req.body.name;
        user.username = req.body.username;
        const result = yield mongodb.getDb().db().collection('users').updateOne({ _id: user_id }, user);
        res.status(200).send(JSON.stringify(result));
        res.status(200).send(JSON.stringify(result.modifiedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.updateUser = updateUser;
// DELETE /users/:id
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // delete the user from test data
    try {
        res.setHeader('Content-Type', 'application/json');
        // get the user from mongodb
        const mongodb = req.locals.mongodb;
        const user_id = new mongodb_1.ObjectId(req.params.id);
        const user = yield mongodb.getDb().db().collection('users').findOne({ _id: user_id });
        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        // delete the user
        const result = yield mongodb.getDb().db().collection('users').deleteOne({ _id: user_id });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.deleteUser = deleteUser;
