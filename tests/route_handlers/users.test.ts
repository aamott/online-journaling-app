import { ObjectId } from 'mongodb';
// const mongodb = require('../db/connect');
import {getActiveUser, getUser, addUser, updateUser, deleteUser} from '../../controllers/users';

let temp_user_id = new ObjectId(1).toString();


// filler data for testing
const fillerUsers = [
    {
        _id: new ObjectId(1),
        name: 'John Doe',
        entry_ids: [
            {
                _id: new ObjectId(1),
                date_created: new Date(),
                title: 'My first entry',
            },
            {
                _id: new ObjectId(2),
                date_created: new Date(),
                title: 'My second entry',
            }
        ],
        goal_ids: [
            {
                _id: new ObjectId(1),
            },
            {
                _id: new ObjectId(2),
            }
        ],
        media_ids: [
            {
                _id: new ObjectId(1),
                date_added: new Date()
            },
            {
                _id: new ObjectId(2),
                date_added: new Date()
            }
        ]
    },
    {
        _id: new ObjectId(2),
        name: 'Jane Doe',
        entry_ids: [
            {
                _id: new ObjectId(3),
                date_created: new Date(),
                title: 'My first entry',
            },
            {
                _id: new ObjectId(4),
                date_created: new Date(),
                title: 'My second entry',
            }
        ],
        goal_ids: [
            {
                _id: new ObjectId(3),
            },
            {
                _id: new ObjectId(4),
            }
        ],
        media_ids: [
            {
                _id: new ObjectId(3),
                date_added: new Date()
            },
            {
                _id: new ObjectId(4),
                date_added: new Date()
            }
        ]
    }
];


describe('Users', () => {

    test('responds to GET /users/active', async () => {
        // create a variable to store the response
        let users_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            users_json = send.mock.calls[0][0];
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
                                            findOne: jest.fn().mockImplementation((query) => {
                                                if (query.sub) {
                                                    return fillerUsers[0];
                                                }
                                            }),
        }}}}}}}}}

        // call the function
        await getActiveUser(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(users_json);
    });


    // test('responds to POST /users', async () => {
    //     // create a variable to store the response
    //     let response_json = "";

    //     // mock the send function
    //     const send = jest.fn().mockImplementation(() => {
    //         response_json = send.mock.calls[0][0];
    //     }
    //     );
    //     // mock the request object
    //     const req = {
    //         body: {
    //             name: "Test User"
    //         }
    //     };

    //     // mock the response
    //     const res = {
    //         user: null,
    //         setHeader: jest.fn(),
    //         status: jest.fn().mockReturnValue({
    //             send: send
    //         }),
    //         send: send,
    //         locals: {
    //             mongodb: {
    //                 getDb: () => {
    //                     return {
    //                         db: () => {
    //                             return {
    //                                 collection: (collectionName: string) => {
    //                                     return {
    //                                         insertOne: jest.fn().mockImplementation((user: any) => {
    //                                             return {
    //                                                 insertedId: new ObjectId(1)
    //                                             }
    //                                         }),
    //                                         find: jest.fn().mockImplementation((query: any) => {
    //                                             return fillerUsers.find(user => user._id.toString() === query._id.toString());
    //                                         }),
    //                                         updateOne: jest.fn().mockImplementation((query: any, update: any) => {
    //                                             return {
    //                                                 matchedCount: 1,
    //                                                 modifiedCount: 1,
    //                                                 upsertedId: new ObjectId(1)
    //                                             }
    //                                         }),
    //                                         deleteOne: jest.fn().mockImplementation((query: any) => {
    //                                             return {
    //                                                 deletedCount: 1
    //                                             }
    //                                         }),
    //                                         deleteMany: jest.fn().mockImplementation((query: any) => {
    //                                             return {
    //                                                 deletedCount: 1
    //                                             }
    //                                         }),
    //                                         findOne: jest.fn().mockImplementation((query: any) => {
    //                                             return fillerUsers.find(user => user._id.toString() === query._id.toString());
    //                                         })
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     };

    //     // call the function
    //     await addUser(req, res);

    //     // check the response
    //     expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(send).toHaveBeenCalled();

    //     // check that the response was an ObjectId
    //     let response = JSON.parse(response_json);

    //     // check that the response was an ObjectId
    //     let id: ObjectId | null;
    //     try {
    //         id = new ObjectId(response);
    //         // temp_user_id = id;
    //     }
    //     catch (err) {
    //         id = null;
    //     }
    //     expect(id).toBeInstanceOf(ObjectId);
    // }
    // );


    // test('responds to GET /users/:id', async () => {
    //     // create a variable to store the response
    //     let user_json = "";

    //     // mock the send function
    //     const send = jest.fn().mockImplementation(() => {
    //         user_json = send.mock.calls[0][0];
    //     });

    //     // mock the request object
    //     const req = {
    //         params: {
    //             id: temp_user_id
    //         }
    //     };

    //     // mock the response
    //     const res = {
    //         user: null,
    //         setHeader: jest.fn(),
    //         status: jest.fn().mockReturnValue({
    //             send: send
    //         }),
    //         send: send,
    //         locals: {
    //             mongodb: {
    //                 getDb: () => {
    //                     return {
    //                         db: () => {
    //                             return {
    //                                 collection: (collectionName: string) => {
    //                                     return {
    //                                         findOne: jest.fn().mockImplementation((query: any) => {
    //                                             // return one mocked user for each query id, with ids matching the query
    //                                             let users = [fillerUsers[0]];
    //                                             query.forEach((_id: ObjectId) => {
    //                                                 const user = fillerUsers[0];
    //                                                 user._id = _id;
    //                                                 users.push(user);
    //                                             });
    //                                             return users;
    //                                         })
    //     };}};}};}}}};

    //     // call the function
    //     await getUser(req, res);

    //     // check the response
    //     expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(send).toHaveBeenCalled();
    //     let response = JSON.parse(user_json);
    //     expect(response).toBeInstanceOf(Object);
    // }
    // );

    // test('responds to PUT /users/:id', async () => {
    //     // create a variable to store the response
    //     let response_json = "";

    //     // mock the send function
    //     const send = jest.fn().mockImplementation(() => {
    //         response_json = send.mock.calls[0][0];
    //     }
    //     );
    //     // mock the request object
    //     const req = {
    //         params: {
    //             id: temp_user_id
    //         },
    //         body: {
    //             name: "Test User"
    //         }
    //     };

    //     // mock the response
    //     const res = {
    //         user: null,
    //         setHeader: jest.fn(),
    //         status: jest.fn().mockReturnValue({
    //             send: send
    //         }),
    //         send: send
    //     };

    //     // call the function
    //     await updateUser(req, res);

    //     // check the response
    //     expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(send).toHaveBeenCalled();

    //     // check that the response was an ObjectId
    //     let response = JSON.parse(response_json);
    //     expect(response).toBeInstanceOf(Object);
    // }
    // );


    // test('responds to DELETE /users/:id', async () => {
    //     // create a variable to store the response
    //     let response_json = "";

    //     // mock the send function
    //     const send = jest.fn().mockImplementation(() => {
    //         response_json = send.mock.calls[0][0];
    //     }
    //     );
    //     // mock the request object
    //     const req = {
    //         params: {
    //             id: temp_user_id
    //         }
    //     };

    //     // mock the response
    //     const res = {
    //         user: null,
    //         setHeader: jest.fn(),
    //         status: jest.fn().mockReturnValue({
    //             send: send
    //         }),
    //         send: send
    //     };

    //     // call the function
    //     await deleteUser(req, res);

    //     // check the response
    //     expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(send).toHaveBeenCalled();

    //     // check that one user was deleted
    //     let response = JSON.parse(response_json);
    //     expect(response).toBe(1);
    // }
    // );

});