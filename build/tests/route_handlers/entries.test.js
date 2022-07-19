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
let temp_entry_id = new mongodb_1.ObjectId(1).toString();
describe('Entries', () => {
    test('responds to GET /entries', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let entries_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            entries_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            oidc: {
                user: {
                    sub: 'Google|23432u432890',
                }
            },
        };
        // mock the response
        const res = {
            users: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send,
            locals: {
                mongodb: {
                    getDb: () => {
                        return {
                            db: () => {
                                return {
                                    collection: (collectionName) => {
                                        return {
                                            find: jest.fn().mockImplementation((query) => {
                                                return {
                                                    toArray: jest.fn().mockImplementation(() => {
                                                        return [{
                                                                _id: temp_entry_id,
                                                                owner_id: 'Google|23432u432890',
                                                                title: 'test',
                                                                content: 'test',
                                                                created_at: new Date(),
                                                                updated_at: new Date(),
                                                            }];
                                                    })
                                                };
                                            }),
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            }
        };
        // call the function
        yield (0, entries_1.getAllEntries)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(entries_json);
        expect(response).toBeInstanceOf(Array);
    }));
    test('responds to POST /entry', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            body: {
                name: "Test Entry",
                entry: "Test Entry content"
            },
            oidc: {
                user: {
                    sub: 'Google|23432u432890',
                }
            },
        };
        // mock the response
        const res = {
            user: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send,
            locals: {
                mongodb: {
                    getDb: () => {
                        return {
                            db: () => {
                                return {
                                    collection: (collectionName) => {
                                        return {
                                            findOne: jest.fn().mockImplementation((query) => {
                                                if (query._id) {
                                                    return {
                                                        owner_id: req.oidc.user.sub,
                                                    };
                                                }
                                            }),
                                            insertOne: jest.fn().mockImplementation((query, update) => {
                                                if (query._id) {
                                                    return {
                                                        insertedId: temp_entry_id,
                                                    };
                                                }
                                            })
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            }
        };
        // call the function
        yield (0, entries_1.addEntry)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
    }));
    test('responds to GET /entries/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let user_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            user_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_entry_id
            },
            oidc: {
                user: {
                    sub: 'Google|23432u432890',
                }
            },
        };
        // mock the response
        const res = {
            user: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send,
            locals: {
                mongodb: {
                    getDb: () => {
                        return {
                            db: () => {
                                return {
                                    collection: (collectionName) => {
                                        return {
                                            findOne: jest.fn().mockImplementation((query) => {
                                                if (query._id) {
                                                    return {
                                                        owner_id: req.oidc.user.sub,
                                                    };
                                                }
                                            }),
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            }
        };
        // call the function
        yield (0, entries_1.getEntry)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(user_json);
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
                name: "Test Entry",
                entry: "Test Entry content"
            },
            oidc: {
                user: {
                    sub: 'Google|23432u432890',
                }
            },
        };
        // mock the response
        const res = {
            entry: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send,
            locals: {
                mongodb: {
                    getDb: () => {
                        return {
                            db: () => {
                                return {
                                    collection: (collectionName) => {
                                        return {
                                            findOne: jest.fn().mockImplementation((query) => {
                                                if (query._id) {
                                                    return {
                                                        owner_id: req.oidc.user.sub,
                                                    };
                                                }
                                            }),
                                            updateOne: jest.fn().mockImplementation((query, update) => {
                                                if (query._id) {
                                                    return {
                                                        modifiedCount: 1,
                                                    };
                                                }
                                            })
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            }
        };
        // call the function
        yield (0, entries_1.updateEntry)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(send).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    }));
    test('responds to DELETE /entry/:id', () => __awaiter(void 0, void 0, void 0, function* () {
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
            oidc: {
                user: {
                    sub: 'Google|23432u432890',
                }
            },
        };
        // mock the response
        const res = {
            user: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send,
            locals: {
                mongodb: {
                    getDb: () => {
                        return {
                            db: () => {
                                return {
                                    collection: (collectionName) => {
                                        return {
                                            findOne: jest.fn().mockImplementation((query) => {
                                                if (query._id) {
                                                    return {
                                                        owner_id: req.oidc.user.sub,
                                                    };
                                                }
                                            }),
                                            deleteOne: jest.fn().mockImplementation((query) => {
                                                if (query._id) {
                                                    return {
                                                        deletedCount: 1,
                                                    };
                                                }
                                            }),
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            }
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
