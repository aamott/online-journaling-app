import { ObjectId } from 'mongodb';
import {getAllEntries, getEntry,  addEntry, updateEntry,  deleteEntry} from '../../controllers/entries';

let temp_entry_id = new ObjectId(1).toString();
describe('Entries', () => {

    test('responds to GET /entries', async () => {
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
                                    collection: (collectionName: string) => {
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
        await getAllEntries(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(entries_json);
        expect(response).toBeInstanceOf(Array);
    });


    test('responds to POST /entry', async () => {
        // create a variable to store the response
        let response_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        }
        );
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
                                    collection: (collectionName: string) => {
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
        await addEntry(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
    }
    );


    test('responds to GET /entries/:id', async () => {
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
                                    collection: (collectionName: string) => {
                                        return {
                                            findOne: jest.fn().mockImplementation((query) => {
                                                if (query._id) {
                                                    return {
                                                        owner_id: req.oidc.user.sub,
                                                    }
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
        await getEntry(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(user_json);
        expect(response).toBeInstanceOf(Object);
    }
    );

    test('responds to PUT /entries/:id', async () => {
        // create a variable to store the response
        let response_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        }
        );
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
                                    collection: (collectionName: string) => {
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
        await updateEntry(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(send).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    }
    );


    test('responds to DELETE /entry/:id', async () => {
        // create a variable to store the response
        let response_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        }
        );
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
                                    collection: (collectionName: string) => {
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
        await deleteEntry(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that one entry was deleted
        let response = JSON.parse(response_json);
        expect(response).toBe(1);
    }
    );

});