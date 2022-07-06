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
const entries_1 = require("../../controllers/entries");
let temp_entry_id = new mongodb_1.ObjectId(1);
describe('Entries', () => {
    test('responds to GET /entries', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let entries_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            entries_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {};
        // mock the response
        const res = {
            entries: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, entries_1.getAllEntries)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(entries_json);
        expect(response).toBeInstanceOf(Array);
        temp_entry_id = response[0]._id;
    }));
    test('responds to POST /entries', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            body: {
                name: "Test Entry"
            }
        };
        // mock the response
        const res = {
            entry: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, entries_1.addEntry)(req, res);
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
            // temp_entry_id = id;
        }
        catch (err) {
            id = null;
        }
        expect(id).toBeInstanceOf(mongodb_1.ObjectId);
    }));
    test('responds to GET /entries/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let entry_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            entry_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_entry_id
            }
        };
        // mock the response
        const res = {
            entry: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, entry_1.getEntry)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(entry_json);
        expect(response).toBeInstanceOf(Object);
    }));
    test('responds to PUT /entries/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_entry_id
            },
            body: {
                name: "Test Entry"
            }
        };
        // mock the response
        const res = {
            entry: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, entries_1.updateEntry)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        expect(response).toBeInstanceOf(Object);
    }));
    test('responds to DELETE /entries/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_entry_id
            }
        };
        // mock the response
        const res = {
            entry: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, entries_1.deleteEntry)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        // check that one entry was deleted
        let response = JSON.parse(response_json);
        expect(response).toBe(1);
    }));
});
