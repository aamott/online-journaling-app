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
const mongodb = require('../db/connect');
// filler data for testing
const fillerEntries = [
    {
        _id: new mongodb_1.ObjectId(1),
        date_created: new Date(),
        date_updated: new Date(),
        date_deleted: null,
        location: 'Google maps readable address, plus code, or lat/long',
        tags: ['tag1', 'tag2', 'tag3'],
        entry: 'Some really long <i>html<i> formatted text. Or Markdown... your choice.',
        media_ids: [
            new mongodb_1.ObjectId(1),
            new mongodb_1.ObjectId(2),
        ],
        goal_ids: [
            new mongodb_1.ObjectId(1),
            new mongodb_1.ObjectId(2),
        ],
    },
    {
        _id: new mongodb_1.ObjectId(2),
        location: null,
        tags: ['tag1', 'tag2', 'tag3'],
        entry: 'Some really long <i>html<i> formatted text. Or Markdown... your choice.',
        date_created: new Date(),
        date_updated: new Date(),
        date_deleted: null,
        media_ids: [
            new mongodb_1.ObjectId(1),
            new mongodb_1.ObjectId(2),
        ],
        goal_ids: [
            new mongodb_1.ObjectId(1),
            new mongodb_1.ObjectId(2),
        ],
    },
];
// GET /entries
const getAllEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(fillerEntries));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getAllEntries = getAllEntries;
// GET /entries/:id
const getEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
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
        let entry = fillerEntries.find((entry) => entry._id.toString() === entryId);
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
        // Make sure media_ids is an Array of ObjectIds
        let media_ids = req.body.media_ids || null;
        if (media_ids && !Array.isArray(media_ids)) {
            media_ids = [media_ids];
        }
        let media_object_ids = [];
        if (media_ids) {
            media_object_ids = media_ids.map((id) => new mongodb_1.ObjectId(id));
        }
        // Make sure goal_ids is an Array of ObjectIds
        let goal_ids = req.body.goal_ids || null;
        if (goal_ids && !Array.isArray(goal_ids)) {
            goal_ids = [goal_ids];
        }
        let goal_object_ids = [];
        if (goal_ids) {
            goal_object_ids = goal_ids.map((id) => new mongodb_1.ObjectId(id));
        }
        let newEntry = {
            _id: new mongodb_1.ObjectId(),
            date_created: new Date(),
            date_updated: new Date(),
            date_deleted: null,
            location: location,
            tags: tags,
            entry: entry,
            media_ids: media_object_ids,
            goal_ids: goal_object_ids
        };
        fillerEntries.push(newEntry);
        newEntry._id = new mongodb_1.ObjectId(fillerEntries.length);
        res.status(200).send(JSON.stringify(newEntry._id));
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
        let entry = fillerEntries.find((entry) => entry._id.toString() === req.params.id);
        // return 404 if entry not found
        if (!entry) {
            res.status(404).send('Entry not found');
            return;
        }
        // update the entry
        entry.entry = req.body.entry || entry.entry;
        entry.date_updated = new Date();
        entry.location = req.body.location || entry.location;
        entry.tags = req.body.tags || entry.tags;
        // Loop through media. If an id doesn't exist in the entry's media, add it.
        for (let media_id of req.body.media_ids) {
            if (!entry.media_ids.includes(media_id)) {
                entry.media_ids.push(media_id);
            }
        }
        // Loop through goals. If an id doesn't exist in the entry's goals, add it.
        for (let goal_id of req.body.goal_ids) {
            if (!entry.goal_ids.includes(goal_id)) {
                entry.goal_ids.push(goal_id);
            }
        }
        res.status(200).send(JSON.stringify(entry));
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
        let entry = fillerEntries.find((entry) => entry._id.toString() === req.params.id);
        // return 404 if entry not found
        if (!entry) {
            res.status(404).send('Entry not found');
            return;
        }
        let index = fillerEntries.indexOf(entry);
        fillerEntries.splice(index, 1);
        res.status(200).send(JSON.stringify(1)); // return number of entries deleted
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.deleteEntry = deleteEntry;
