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
exports.deleteMedia = exports.addMedia = exports.getMedia = exports.getAllMedia = void 0;
/******************
 * ENTRIES CONTROLLER
 */
const mongodb_1 = require("mongodb");
const mongodb = require('../db/connect');
// filler data for testing
const fillerMedia = [
    {
        _id: new mongodb_1.ObjectId(1),
        owner_id: new mongodb_1.ObjectId(1),
        date_uploaded: new Date(),
        location: 'lat/long',
        tags: ['tag1', 'tag2', 'tag3'],
        media_uri: 'URI',
        entry_ids: [
            new mongodb_1.ObjectId(1),
            new mongodb_1.ObjectId(2),
        ],
    },
    {
        _id: new mongodb_1.ObjectId(2),
        owner_id: new mongodb_1.ObjectId(1),
        location: null,
        tags: ['tag1', 'tag2', 'tag3'],
        media_uri: 'URI',
        date_uploaded: new Date(),
        entry_ids: [
            new mongodb_1.ObjectId(1),
            new mongodb_1.ObjectId(2),
        ],
    },
];
// GET /media
const getAllMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        //const mongodb = res.locals.mongodb;
        const media = yield mongodb.getDb().db().collection('media').find().toArray();
        res.status(200).send(JSON.stringify(media));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.getAllMedia = getAllMedia;
// GET /media/:id
const getMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    // get the media ID from the URL
    //const mediaId = req.params.id;
    try {
        res.setHeader('Content-Type', 'application/json');
        //let media = fillerMedia.find((media) => media._id.toString() === mediaId);
        const mediaId = new mongodb_1.ObjectId(req.params.id);
        if (!mediaId) {
            res.status(400).send('No media ID provided');
            return;
        }
        if (!mongodb_1.ObjectId.isValid(mediaId)) {
            res.status(400).send('Invalid media ID');
            return;
        }
        const media = yield mongodb.getDb().db().collection('media').find(mediaId).toArray();
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
});
exports.getMedia = getMedia;
// POST /media
const addMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // add the media to test data
    try {
        res.setHeader('Content-Type', 'application/json');
        let owner_id = new mongodb_1.ObjectId(req.body.owner_id);
        let location = req.body.location;
        //let tags = req.body.tags
        let media_uri = req.body.media_uri;
        // // make sure tags is a list
        // if (tags && !Array.isArray(tags)) {
        //     tags = [tags];
        // }
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
        let entry_object_ids = [];
        if (entry_ids) {
            entry_object_ids = entry_ids.map((id) => new mongodb_1.ObjectId(id));
        }
        let newMedia = {
            //_id: new ObjectId(),
            owner_id: owner_id,
            date_uploaded: new Date(),
            location: location,
            //tags: tags,
            media_uri: media_uri,
            entry_ids: entry_object_ids,
        };
        //fillerMedia.push(newMedia);
        const result = yield mongodb.getDb().db().collection('media').insertOne(newMedia);
        //newMedia._id = new ObjectId(fillerMedia.length);
        res.status(200).send(JSON.stringify(result.insertId));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.addMedia = addMedia;
// // PUT /media/:id
// const updateMedia = async (req: {
//     params: { id: string; }; body: {
//         location: string | null;
//         tags: Array<string>;
//         media_uri: string;
//         entry_ids: Array<string> | null;
//     };
// }, res: any) => {
//     res.setHeader('Content-Type', 'application/json');
//     // update the media
//     try {
//         let media = fillerMedia.find((media) => media._id.toString() === req.params.id);
//         // return 404 if media not found
//         if (!media) {
//             res.status(404).send('Media not found');
//             return;
//         }
//         // update the media
//         media.media_uri = req.body.media_uri || media.media_uri;
//         media.date_uploaded = new Date();
//         media.location = req.body.location || media.location;
//         media.tags = req.body.tags || media.tags;
//         // Loop through media. If an id doesn't exist in the media's media, add it.
//         if (req.body.entry_ids) {
//             // convert entry_ids to objectIds and add to media.entry_ids
//             let entry_object_ids: ObjectId[] = [];
//             req.body.entry_ids.forEach((id) => {
//                 entry_object_ids.push(new ObjectId(id));
//             }
//             );
//             media.entry_ids = entry_object_ids;
//         }
//         res.status(200).send(JSON.stringify(media));
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// };
// DELETE /media/:id
const deleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Media']
    // delete the media from test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const mediaId = req.params.id;
        const media = yield mongodb.getDb().db().collection('media').findOne({ _id: mediaId });
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
});
exports.deleteMedia = deleteMedia;
