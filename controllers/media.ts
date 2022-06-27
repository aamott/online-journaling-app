/******************
 * ENTRIES CONTROLLER
 */
import { ObjectId } from 'mongodb';
const mongodb = require('../db/connect');

// filler data for testing
const fillerMedia = [
    {
        _id: new ObjectId(1),
        owner_id: new ObjectId(1),
        date_uploaded: new Date(),
        location: 'lat/long',
        tags: ['tag1', 'tag2', 'tag3'],
        media_uri: 'URI',
        entry_ids: [
            new ObjectId(1),
            new ObjectId(2),
        ],
    },
    {
        _id: new ObjectId(2),
        owner_id: new ObjectId(1),
        location: null,
        tags: ['tag1', 'tag2', 'tag3'],
        media_uri: 'URI',
        date_uploaded: new Date(),
        entry_ids: [
            new ObjectId(1),
            new ObjectId(2),
        ],
    },
];


// GET /media
const getAllMedia = async (req: any, res: any) => {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(fillerMedia));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// GET /media/:id
const getMedia = async (req: any, res: any) => {
    // return test data
    // get the media ID from the URL
    const mediaId = req.params.id;

    if (!mediaId) {
        res.status(400).send('No media ID provided');
        return;
    }

    if (!ObjectId.isValid(mediaId)) {
        res.status(400).send('Invalid media ID');
        return;
    }

    try {
        res.setHeader('Content-Type', 'application/json');
        let media = fillerMedia.find((media) => media._id.toString() === mediaId);

        // return 404 if media not found
        if (!media) {
            res.status(404).send('Media not found');
            return;
        }

        res.status(200).send(JSON.stringify(media));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// POST /media
const addMedia = async (req: {
    body: {
        owner_id: any;
        location: string | null;
        tags: Array<string>;
        media_uri: string;
        entry_ids: Array<string> | null;
    };
}, res: any) => {
    // add the media to test data
    try {
        res.setHeader('Content-Type', 'application/json');

        let owner_id = req.body.owner_id;
        owner_id = new ObjectId(owner_id);
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
            res.status(400).send('No media provided');
            return;
        }

        // Make sure entry_ids is an Array of ObjectIds
        let entry_ids = req.body.entry_ids || null;
        if (entry_ids && !Array.isArray(entry_ids)) {
            entry_ids = [entry_ids];
        }
        let entry_object_ids: ObjectId[] = [];
        if (entry_ids) {
            entry_object_ids = entry_ids.map((id) => new ObjectId(id));
        }


        let newMedia = {
            _id: new ObjectId(),
            owner_id: owner_id,
            date_uploaded: new Date(), // Journal media typically use a date in place of a title.
            location: location,
            tags: tags,
            media_uri: media_uri,
            entry_ids: entry_object_ids,
        };

        fillerMedia.push(newMedia);
        newMedia._id = new ObjectId(fillerMedia.length);
        res.status(200).send(JSON.stringify(newMedia._id));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// PUT /media/:id
const updateMedia = async (req: {
    params: { id: string; }; body: {
        location: string | null;
        tags: Array<string>;
        media_uri: string;
        entry_ids: Array<string> | null;
    };
}, res: any) => {

    res.setHeader('Content-Type', 'application/json');
    // update the media
    try {
        let media = fillerMedia.find((media) => media._id.toString() === req.params.id);

        // return 404 if media not found
        if (!media) {
            res.status(404).send('Media not found');
            return;
        }

        // update the media
        media.media_uri = req.body.media_uri || media.media_uri;
        media.date_uploaded = new Date();
        media.location = req.body.location || media.location;
        media.tags = req.body.tags || media.tags;


        // Loop through media. If an id doesn't exist in the media's media, add it.
        if (req.body.entry_ids) {
            // convert entry_ids to objectIds and add to media.entry_ids
            let entry_object_ids: ObjectId[] = [];
            req.body.entry_ids.forEach((id) => {
                entry_object_ids.push(new ObjectId(id));
            }
            );
            media.entry_ids = entry_object_ids;
        }

        res.status(200).send(JSON.stringify(media));
    }
    catch (err) {
        res.status(500).send(err);
    }
};


// DELETE /media/:id
const deleteMedia = async (req: any, res: any) => {
    // #swagger.tags = ['Media']

    // delete the media from test data
    try {
        res.setHeader('Content-Type', 'application/json');
        let media = fillerMedia.find((media) => media._id.toString() === req.params.id);

        // return 404 if media not found
        if (!media) {
            res.status(404).send('Media not found');
            return;
        }

        let index = fillerMedia.indexOf(media);
        fillerMedia.splice(index, 1);
        res.status(200).send(JSON.stringify(1)); // return number of media deleted
    }
    catch (err) {
        res.status(500).send(err);
    }
};


export { getAllMedia, getMedia, addMedia, updateMedia, deleteMedia };