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
// GET /media
const getAllMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return test data
    try {
        res.setHeader('Content-Type', 'application/json');
        const userId = req.oidc.user.sub;
        // get the user's media
        const user = yield mongodb.getDb().db().collection('users').findOne({ _id: userId });
        // return 404 if user not found
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        // get the user's media
        const mediaIds = user.media_ids;
        const media = yield mongodb.getDb().db().collection('media').find({ _id: { $in: mediaIds } }).toArray();
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
exports.getAllMedia = getAllMedia;
// GET /media/:id
const getMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Content-Type', 'application/json');
        const mediaId = new mongodb_1.ObjectId(req.params.id);
        if (!mediaId) {
            res.status(400).send('No media ID provided');
            return;
        }
        const media = yield mongodb.getDb().db().collection('media').find(mediaId).toArray();
        // return 404 if media not found
        if (!media) {
            res.status(404).send('Media not found');
            return;
        }
        // make sure user is owner of media
        if (media.owner_id !== req.oidc.user.sub) {
            res.status(403).send('You are not authorized to view this media');
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
    try {
        res.setHeader('Content-Type', 'application/json');
        let owner_id = req.oidc.user.sub;
        let location = req.body.location;
        let tags = req.body.tags;
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
        let entry_object_ids = [];
        if (entry_ids) {
            entry_object_ids = entry_ids.map((id) => new mongodb_1.ObjectId(id));
        }
        let newMedia = {
            owner_id: owner_id,
            date_uploaded: new Date(),
            location: location,
            media_uri: media_uri,
            entry_ids: entry_object_ids,
        };
        const result = yield mongodb.getDb().db().collection('media').insertOne(newMedia);
        res.status(200).send(JSON.stringify(result.insertId));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.addMedia = addMedia;
// DELETE /media/:id
const deleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // delete the media
    try {
        res.setHeader('Content-Type', 'application/json');
        const mediaId = req.params.id;
        const userId = req.oidc.user.sub;
        const media = yield mongodb.getDb().db().collection('media').findOne({ _id: mediaId });
        // return 404 if media not found
        if (!media) {
            res.status(404).send('Media not found');
            return;
        }
        // make sure user is owner of media
        if (media.owner_id !== userId) {
            res.status(403).send('You are not authorized to delete this media');
            return;
        }
        // delete media
        const result = yield mongodb.getDb().db().collection('media').deleteOne({ _id: mediaId });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.deleteMedia = deleteMedia;
