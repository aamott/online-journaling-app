/******************
 * ENTRIES CONTROLLER
 */
import { ObjectIdLike } from 'bson';
import { ObjectId } from 'mongodb';
const mongodb = require('../db/connect');

// GET /entries
const getAllEntries = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json');

        const mongodb = req.locals.mongodb;
        const entries = await mongodb.getDb().db().collection('entries').find().toArray();

        res.status(200).send(JSON.stringify(entries));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// GET /entries/:id
const getEntry = async (req: any, res: any) => {
    // get the entry ID from the URL
    const entryId = req.params.id;

    if (!entryId) {
        res.status(400).send('No entry ID provided');
        return;
    }

    if (!ObjectId.isValid(entryId)) {
        res.status(400).send('Invalid entry ID');
        return;
    }

    try {
        res.setHeader('Content-Type', 'application/json');

        const mongodb = req.locals.mongodb;
        const entry = await mongodb.getDb().db().collection('entries').findOne({ _id: new ObjectId(entryId) });

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
};


// POST /entries
const addEntry = async (req: { body: any; locals?: any; }, res: any) => {
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
            date_created: new Date(), // Journal entries typically use a date in place of a title.
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
        const result = await mongodb.getDb().db().collection('entries').insertOne(newEntry);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// PUT /entries/:id
const updateEntry = async (req: { params: any; body: any; locals?: any; }, res: any) => {

    res.setHeader('Content-Type', 'application/json');
    // update the entry
    try {
        const mongodb = req.locals.mongodb;
        let entry = await mongodb.getDb().db().collection('entries').findOne({ _id: new ObjectId(req.params.id) });

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
            media_ids = media_ids.map((id: string) => new ObjectId(id));
        }

        // convert goal_ids to a list of ObjectIds
        let goal_ids = req.body.goal_ids;
        if (goal_ids && !Array.isArray(goal_ids)) {
            goal_ids = [goal_ids];
        }
        if (goal_ids) {
            goal_ids = goal_ids.map((id: string) => new ObjectId(id));
        }
        

        // update the entry
        entry.entry = req.body.entry || entry.entry;
        entry.date_updated = new Date();
        entry.location = req.body.location || entry.location;
        entry.tags = req.body.tags || entry.tags;
        entry.media_ids = req.body.media_ids || entry.media_ids;
        entry.goal_ids = req.body.goal_ids || entry.goal_ids;

        // update the entry in the database
        const result = await mongodb.getDb().db().collection('entries').updateOne({ _id: new ObjectId(req.params.id) }, entry);
        res.status(200).send(JSON.stringify(result.modifiedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// DELETE /entries/:id
const deleteEntry = async (req: any, res: any) => {
    // #swagger.tags = ['Entries']

    // delete the entry from test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const mongodb = req.locals.mongodb;
        let entry_id = new ObjectId(req.params.id);
        let entry = await mongodb.getDb().db().collection('entries').findOne({ _id: entry_id });

        // return 404 if entry not found
        if (!entry) {
            res.status(404).send('Entry not found');
            return;
        }

        // delete the entry from the database
        const result = await mongodb.getDb().db().collection('entries').deleteOne({ _id: entry_id });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


export { getAllEntries, getEntry, addEntry, updateEntry, deleteEntry };