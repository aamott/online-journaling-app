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
const mongodb_1 = require("mongodb");
const media_1 = require("../../controllers/media");
let temp_media_id = new mongodb_1.ObjectId(1);
describe('Media', () => {
    test('responds to GET /media', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let media_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            media_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {};
        // mock the response
        const res = {
            media: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, media_1.getAllMedia)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(media_json);
        expect(response).toBeInstanceOf(Array);
        temp_media_id = response[0]._id;
    }));
    test('responds to POST /media', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            body: {
                name: "Test Media"
            }
        };
        // mock the response
        const res = {
            media: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, media_1.addMedia)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        // check that the response was an ObjectId
        let id;
        try {
            id = new mongodb_1.ObjectId(response);
            // temp_media_id = id;
        }
        catch (err) {
            id = null;
        }
        expect(id).toBeInstanceOf(mongodb_1.ObjectId);
    }));
    test('responds to GET /media/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let media_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            media_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_media_id
            }
        };
        // mock the response
        const res = {
            media: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, media_1.getMedia)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(media_json);
        expect(response).toBeInstanceOf(Object);
    }));
    test('responds to PUT /media/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_media_id
            },
            body: {
                name: "Test Media"
            }
        };
        // mock the response
        const res = {
            media: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, media_1.updateMedia)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        expect(response).toBeInstanceOf(Object);
    }));
    test('responds to DELETE /media/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_media_id
            }
        };
        // mock the response
        const res = {
            media: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, media_1.deleteMedia)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        // check that one media item was deleted
        let response = JSON.parse(response_json);
        expect(response).toBe(1);
    }));
});