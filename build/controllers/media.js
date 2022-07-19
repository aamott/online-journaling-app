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
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        user.id = user.sub;
        // get the user's media
        const media = yield mongodb.getDb().db().collection('media').find({ owner_id: user.sub });
        if (!media) {
            res.status(404).send(JSON.stringify('No media found'));
            return;
        }
        const mediaArray = media.toArray();
        res.status(200).send(JSON.stringify(mediaArray));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.getAllMedia = getAllMedia;
// GET /media/:id
const getMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.status(400).send(JSON.stringify('Invalid media id'));
            return;
        }
        const mediaId = new mongodb_1.ObjectId(req.params.id);
        if (!mediaId) {
            res.status(400).send(JSON.stringify('No media ID provided'));
            return;
        }
        const media = yield mongodb.getDb().db().collection('media').findOne({ _id: mediaId });
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
            res.status(400).send(JSON.stringify('No media provided'));
            return;
        }
        // Make sure entry_ids is an Array of ObjectIds
        let entry_ids = req.body.entry_ids || null;
        if (entry_ids && !Array.isArray(entry_ids)) {
            entry_ids = [entry_ids];
        }
        let entry_object_ids = [];
        if (entry_ids) {
            entry_object_ids = entry_ids.map((id) => {
                if (mongodb_1.ObjectId.isValid(id)) {
                    return new mongodb_1.ObjectId(id);
                }
                return null;
            });
        }
        let newMedia = {
            owner_id: owner_id,
            date_uploaded: new Date(),
            location: location,
            media_uri: media_uri,
            entry_ids: entry_object_ids,
        };
        const result = yield mongodb.getDb().db().collection('media').insertOne(newMedia);
        res.status(200).send(JSON.stringify(result.insertedId));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.addMedia = addMedia;
// DELETE /media/:id
const deleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // delete the media
    try {
        res.setHeader('Content-Type', 'application/json');
        const user = req.oidc.user;
        // return 404 if user not found
        if (!user) {
            res.status(404).send(JSON.stringify('User not found'));
            return;
        }
        if (!mongodb_1.ObjectId.isValid(req.params.id)) {
            res.status(400).send(JSON.stringify('Invalid media id'));
            return;
        }
        const mediaId = new mongodb_1.ObjectId(req.params.id);
        if (!mediaId) {
            res.status(400).send(JSON.stringify('No media ID provided'));
            return;
        }
        const media = yield mongodb.getDb().db().collection('media').findOne({ _id: mediaId });
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
        const result = yield mongodb.getDb().db().collection('media').deleteOne({ _id: mediaId });
        res.status(200).send(JSON.stringify(result.deletedCount));
    }
    catch (err) {
        res.status(500).send("Internal server error");
    }
});
exports.deleteMedia = deleteMedia;
