/******************
 * ENTRIES CONTROLLER
 */
import { ObjectId } from 'mongodb';

// GET /entries
const getAllEntries = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json');

        const mongodb = res.locals.mongodb;
        const user = req.oidc.user;

        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        user.id = user.sub;

        const user_id = user.sub;
        const entries = await mongodb.getDb().db().collection('entries').find({ owner_id: user_id });
        res.status(200).send(JSON.stringify(entries));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// GET /entries/:id
const getEntry = async (req: any, res: any) => {
    // get the entry ID from the URL
    try {
        res.setHeader('Content-Type', 'application/json');
        const entryId = req.params.id; 
        const user = req.oidc.user;

        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        user.id = user.sub;

        if (!entryId) {
            res.status(400).send('No entry ID provided');
            return;
        }

        const mongodb = res.locals.mongodb;
        const entry = await mongodb.getDb().db().collection('entries').findOne({ _id: new ObjectId(entryId) });

        // return 404 if entry not found
        if (!entry) {
            res.status(404).send('Entry not found');
            return;
        }

        // return 403 if entry not owned by user
        if (entry.owner_id !== user.sub) {
            res.status(403).send('You are not authorized to view this entry');
            return;
        }

        res.status(200).send(JSON.stringify(entry));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// POST /entries
const addEntry = async (req: any, res: any) => {
    // add the entry to test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;

        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        user.id = user.sub;

        // DATA VALIDATION
        // entry should be a string
        let entry = req.body.entry || null;
        if (!entry) {
            res.status(400).send('No entry provided');
            return;
        }

        const location:string | null = req.body.location;
        let tags: string[] | null = req.body.tags;

        // make sure tags is a list
        if (req.body.tags && !Array.isArray(req.body.tags)) {
            tags = [req.body.tags];
        } else if (!req.body.tags) {
            tags = [];
        }

        // make sure media_ids is a list
        let media_ids: string[] | null = req.body.media_ids;
        if (req.body.media_ids && !Array.isArray(req.body.media_ids)) {
            media_ids = [req.body.media_ids];
        } else if (!req.body.media_ids) {
            media_ids = [];
        }
        
        // ADD THE ENTRY
        const mongodb = res.locals.mongodb;

        let newEntry = {
            owner_id: user.sub,
            date_created: new Date(), // Journal entries typically use a date in place of a title.
            date_updated: new Date(),
            date_deleted: null,
            location: location,
            tags: tags,
            entry: entry,
            media_ids: media_ids,
            goal_ids: []
        };

        // add the entry to the database
        const result = await mongodb.getDb().db().collection('entries').insertOne(newEntry);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// PUT /entries/:id
const updateEntry = async (req: any, res: any) => {

    // update the entry
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;

        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        user.id = user.sub;

        // check that the id is valid
        const entryId = req.params.id;
        if (!entryId) {
            res.status(400).send('No entry ID provided');
            return;
        } else if (!ObjectId.isValid(entryId)) {
            res.status(400).send('Invalid entry ID');
            return;
        }
        const mongodb = res.locals.mongodb;
        let entry = await mongodb.getDb().db().collection('entries').findOne({ _id: new ObjectId(req.params.id) });

        // return 403 if entry not owned by user
        if (entry.owner_id !== user.sub) {
            res.status(403).send('You are not authorized to update this entry');
            return;
        }

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
            media_ids = media_ids.map((id: string) => {
                if (ObjectId.isValid(id)) {
                    return new ObjectId(id);
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
            goal_ids = goal_ids.map((id: string) => {
                if (ObjectId.isValid(id)) {
                    return new ObjectId(id);
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
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify("Invalid entry ID'"));
            return;
        }

        // update the entry in the database
        const result = await mongodb.getDb().db().collection('entries').updateOne({ _id: new ObjectId(req.params.id) }, { $set: entry });
        res.status(200).send(JSON.stringify(result.modifiedCount));

    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// DELETE /entries/:id
const deleteEntry = async (req: any, res: any) => {
    // #swagger.tags = ['Entries']

    // delete the entry from test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;

        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        user.id = user.sub;

        const mongodb = res.locals.mongodb;
        let entry_id = new ObjectId(req.params.id);
        let entry = await mongodb.getDb().db().collection('entries').findOne({ _id: entry_id });

        // return 403 if entry not owned by user
        if (entry.owner_id !== user.sub) {
            res.status(403).send('You are not authorized to delete this entry');
            return;
        }

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
        res.status(500).send("Internal server error");
    }
};


export { getAllEntries, getEntry, addEntry, updateEntry, deleteEntry };