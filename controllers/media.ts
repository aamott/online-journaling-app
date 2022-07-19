/******************
 * ENTRIES CONTROLLER
 */
import { ObjectId } from 'mongodb';
const mongodb = require('../db/connect');


// GET /media
const getAllMedia = async (req: any, res: any) => {
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

        // get the user's media
        const media = await mongodb.getDb().db().collection('media').find({owner_id:user.sub}).toArray();

        res.status(200).send(JSON.stringify(media));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// GET /media/:id
const getMedia = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;
        
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid media id'));
            return;
        }
        const mediaId = new ObjectId(req.params.id);

        if (!mediaId) {
            res.status(400).send(JSON.stringify('No media ID provided'));
            return;
        }
    
        const media = await mongodb.getDb().db().collection('media').findOne({_id:mediaId});

        // return 404 if media not found
        if (!media) {
            res.status(404).send(JSON.stringify('Media not found'));
            return;
        }

        // make sure user is owner of media
        if (media.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('You are not authorized to view this media'));
            return;
        }

        res.status(200).send(JSON.stringify(media));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// POST /media
const addMedia = async (req: any, res: any) => {
    try {
        res.setHeader('Content-Type', 'application/json');

        let owner_id = req.oidc.user.sub;
        let location = req.body.location;
        let tags = req.body.tags
        let media_uri = req.body.media_uri;

        // make sure tags is a list
        if (tags && !Array.isArray(tags)) {
            tags = [tags];
        }

        // media should be a string
        let media = req.body.media_uri || null;
        if (!media) {
            res.status(400).send(JSON.stringify('No media provided'));
            return;
        }

        // Make sure entry_ids is an Array of ObjectIds
        let entry_ids = req.body.entry_ids || null;
        if (entry_ids && !Array.isArray(entry_ids)) {
            entry_ids = [entry_ids];
        }
        let entry_object_ids: ObjectId[] = [];
        if (entry_ids) {
            entry_object_ids = entry_ids.map((id:any) => {
                if (ObjectId.isValid(id)) {
                    return new ObjectId(id);
                }
                return null;
            });
        }


        let newMedia = {
            owner_id: owner_id,
            date_uploaded: new Date(), // Journal media typically use a date in place of a title.
            location: location,
            media_uri: media_uri,
            entry_ids: entry_object_ids,
        };

        const result = await mongodb.getDb().db().collection('media').insertOne(newMedia);
        res.status(200).send(JSON.stringify( result.insertedId ));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


// DELETE /media/:id
const deleteMedia = async (req: any, res: any) => {
    // delete the media
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        if (!ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid media id'));
            return;
        }
        const mediaId = new ObjectId(req.params.id);

        if (!mediaId) {
            res.status(400).send(JSON.stringify('No media ID provided'));
            return;
        }

        const media = await mongodb.getDb().db().collection('media').findOne({ _id: mediaId });

        // return 404 if media not found
        if (!media) {
            res.status(404).send(JSON.stringify('Media not found'));
            return;
        }

        // make sure user is owner of media
        if (media.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('You are not authorized to view this media'));
            return;
        }

        // make sure user is owner of media
        if (media.owner_id !== user.sub) {
            res.status(403).send(JSON.stringify('You are not authorized to delete this media'));
            return;
        }

        // delete media
        const result = await mongodb.getDb().db().collection('media').deleteOne({_id:mediaId});
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
};


export { getAllMedia, getMedia, addMedia, deleteMedia };