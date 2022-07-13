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
const mongodb_1 = require("mongodb");
const mongodb = require('../db/connect');
// GET /entries
const getAllEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        const entries = yield mongodb.getDb().db().collection('entries').find().toArray();
        res.status(200).send(JSON.stringify(entries));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getAllEntries = getAllEntries;
// GET /entries/:id
const getEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the entry ID from the URL
    const entryId = req.params.id;
    if (!entryId) {
        res.status(400).send('No entry ID provided');
        return;
    }
    if (!mongodb_1.ObjectId.isValid(entryId)) {
        res.status(400).send('Invalid entry ID');
        return;
    }
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        const entry = yield mongodb.getDb().db().collection('entries').findOne({ _id: new mongodb_1.ObjectId(entryId) });
        // return 404 if entry not found
        if (!entry) {
            res.status(404).send('Entry not found');
            return;
        }
        res.status(200).send(JSON.stringify(entry));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getEntry = getEntry;
// POST /entries
const addEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // add the entry to test data
    try {
        res.setHeader('Content-Type', 'application/json');
        let location = req.body.location;
        let tags = req.body.tags;
        // make sure tags is a list
        if (tags && !Array.isArray(tags)) {
            tags = [tags];
        }
        // entry should be a string
        let entry = req.body.entry || null;
        if (!entry) {
            res.status(400).send('No entry provided');
            return;
        }
        let newEntry = {
            date_created: new Date(),
            date_updated: new Date(),
            date_deleted: null,
            location: location,
            tags: tags,
            entry: entry,
            media_ids: [],
            goal_ids: []
        };
        // add the entry to the database
        const mongodb = req.locals.mongodb;
        const result = yield mongodb.getDb().db().collection('entries').insertOne(newEntry);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.addEntry = addEntry;
// PUT /entries/:id
const updateEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Content-Type', 'application/json');
    // update the entry
    try {
        const mongodb = req.locals.mongodb;
        let entry = yield mongodb.getDb().db().collection('entries').findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        // return 404 if entry not found
        if (!entry) {
            res.status(404).send('Entry not found');
            return;
        }
        // convert media_ids to a list of ObjectIds
        let media_ids = req.body.media_ids;
        if (media_ids && !Array.isArray(media_ids)) {
            media_ids = [media_ids];
        }
        if (media_ids) {
            media_ids = media_ids.map((id) => new mongodb_1.ObjectId(id));
        }
        // convert goal_ids to a list of ObjectIds
        let goal_ids = req.body.goal_ids;
        if (goal_ids && !Array.isArray(goal_ids)) {
            goal_ids = [goal_ids];
        }
        if (goal_ids) {
            goal_ids = goal_ids.map((id) => new mongodb_1.ObjectId(id));
        }
        // update the entry
        entry.entry = req.body.entry || entry.entry;
        entry.date_updated = new Date();
        entry.location = req.body.location || entry.location;
        entry.tags = req.body.tags || entry.tags;
        entry.media_ids = req.body.media_ids || entry.media_ids;
        entry.goal_ids = req.body.goal_ids || entry.goal_ids;
        // update the entry in the database
        const result = yield mongodb.getDb().db().collection('entries').updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, entry);
        res.status(200).send(JSON.stringify(result.modifiedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.updateEntry = updateEntry;
// DELETE /entries/:id
const deleteEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Entries']
    // delete the entry from test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        let entry_id = new mongodb_1.ObjectId(req.params.id);
        let entry = yield mongodb.getDb().db().collection('entries').findOne({ _id: entry_id });
        // return 404 if entry not found
        if (!entry) {
            res.status(404).send('Entry not found');
            return;
        }
        // delete the entry from the database
        const result = yield mongodb.getDb().db().collection('entries').deleteOne({ _id: entry_id });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.deleteEntry = deleteEntry;
