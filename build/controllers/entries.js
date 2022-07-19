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
exports.deleteEntry = exports.updateEntry = exports.addEntry = exports.getEntry = exports.getAllEntries = void 0;
/******************
 * ENTRIES CONTROLLER
 */
const mongodb_1 = require("mongodb");
// GET /entries
const getAllEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = res.locals.mongodb;
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
        const user_id = user.sub;
        const entries = yield mongodb.getDb().db().collection('entries').find({ owner_id: user_id });
        const entriesList = yield entries.toArray();
        res.status(200).send(JSON.stringify(entriesList));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.getAllEntries = getAllEntries;
// GET /entries/:id
const getEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the entry ID from the URL
    try {
        res.setHeader('Content-Type', 'application/json');
        const entryId = req.params.id;
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;
        if (!entryId) {
            res.status(400).send(JSON.stringify('No entry ID provided'));
            return;
        }
        if (!mongodb_1.ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid id'));
            return;
        }
        const mongodb = res.locals.mongodb;
        const entry = yield mongodb.getDb().db().collection('entries').findOne({ _id: new mongodb_1.ObjectId(entryId) });
        // return 404 if entry not found
        if (!entry) {
            res.status(404).send(JSON.stringify('Entry not found'));
            return;
        }
        // return 403 if entry not owned by user
        if (entry.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('You are not authorized to view this entry'));
            return;
        }
        res.status(200).send(JSON.stringify(entry));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.getEntry = getEntry;
// POST /entries
const addEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // add the entry to test data
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
        // DATA VALIDATION
        // entry should be a string
        let entry = req.body.entry || null;
        if (!entry) {
            res.status(400).send(JSON.stringify('No entry provided'));
            return;
        }
        const location = req.body.location;
        let tags = req.body.tags;
        // make sure tags is a list
        if (req.body.tags && !Array.isArray(req.body.tags)) {
            tags = [req.body.tags];
        }
        else if (!req.body.tags) {
            tags = [];
        }
        // make sure media_ids is a list
        let media_ids = req.body.media_ids;
        if (req.body.media_ids && !Array.isArray(req.body.media_ids)) {
            media_ids = [req.body.media_ids];
        }
        else if (!req.body.media_ids) {
            media_ids = [];
        }
        // ADD THE ENTRY
        const mongodb = res.locals.mongodb;
        let newEntry = {
            owner_id: user.sub,
            date_created: new Date(),
            date_updated: new Date(),
            date_deleted: null,
            location: location,
            tags: tags,
            entry: entry,
            media_ids: media_ids,
            goal_ids: []
        };
        // add the entry to the database
        const result = yield mongodb.getDb().db().collection('entries').insertOne(newEntry);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.addEntry = addEntry;
// PUT /entries/:id
const updateEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // update the entry
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;
        // check that the id is valid
        const entryId = req.params.id;
        if (!entryId) {
            // convert the error to a JSON string and send it
            res.status(400).send(JSON.stringify('No entry ID provided'));
            return;
        }
        else if (!mongodb_1.ObjectId.isValid(entryId)) {
            res.status(400).send(JSON.stringify('Invalid entry ID'));
            return;
        }
        const mongodb = res.locals.mongodb;
        let entry = yield mongodb.getDb().db().collection('entries').findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        // return 403 if entry not owned by user
        if (entry.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('You are not authorized to update this entry'));
            return;
        }
        // return 404 if entry not found
        if (!entry) {
            res.status(404).send(JSON.stringify('Entry not found'));
            return;
        }
        // convert media_ids to a list of ObjectIds
        let media_ids = req.body.media_ids;
        if (media_ids && !Array.isArray(media_ids)) {
            media_ids = [media_ids];
        }
        if (media_ids) {
            media_ids = media_ids.map((id) => {
                if (mongodb_1.ObjectId.isValid(id)) {
                    return new mongodb_1.ObjectId(id);
                }
                return null;
            });
        }
        // convert goal_ids to a list of ObjectIds
        let goal_ids = req.body.goal_ids;
        if (goal_ids && !Array.isArray(goal_ids)) {
            goal_ids = [goal_ids];
        }
        if (goal_ids) {
            goal_ids = goal_ids.map((id) => {
                if (mongodb_1.ObjectId.isValid(id)) {
                    return new mongodb_1.ObjectId(id);
                }
                return null;
            });
        }
        // update the entry
        entry.entry = req.body.entry || entry.entry;
        entry.date_updated = new Date();
        entry.location = req.body.location || entry.location;
        entry.tags = req.body.tags || entry.tags;
        entry.media_ids = req.body.media_ids || entry.media_ids;
        entry.goal_ids = req.body.goal_ids || entry.goal_ids;
        // Check that the entry id is valid
        if (!mongodb_1.ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify("Invalid entry ID'"));
            return;
        }
        // update the entry in the database
        const result = yield mongodb.getDb().db().collection('entries').updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: entry });
        res.status(200).send(JSON.stringify(result.modifiedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.updateEntry = updateEntry;
// DELETE /entries/:id
const deleteEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Entries']
    // delete the entry from test data
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
        let entry_id = new mongodb_1.ObjectId(req.params.id);
        let entry = yield mongodb.getDb().db().collection('entries').findOne({ _id: entry_id });
        // return 403 if entry not owned by user
        if (entry.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('You are not authorized to delete this entry'));
            return;
        }
        // return 404 if entry not found
        if (!entry) {
            res.status(404).send(JSON.stringify('Entry not found'));
            return;
        }
        // delete the entry from the database
        const result = yield mongodb.getDb().db().collection('entries').deleteOne({ _id: entry_id });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.deleteEntry = deleteEntry;
