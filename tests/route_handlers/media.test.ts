import { ObjectId } from 'mongodb';
import {getAllMedia, getMedia,addMedia, updateMedia, deleteMedia} from '../../controllers/media';

let temp_user_id = new ObjectId(1);
describe('Media', () => {

    test('responds to GET /media', async () => {
        // create a variable to store the response
        let users_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            users_json = send.mock.calls[0][0];
        });

        // mock the request object
        const req = {};

        // mock the response
        const res = {
            users: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };

        // call the function
        await getAllMedia(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(users_json);
        expect(response).toBeInstanceOf(Array);

        temp_user_id = response[0]._id;
    });


    test('responds to POST /media', async () => {
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
                owner_id: "Test Owner",
                location: "Anywhere",
                tags: ['test'],
                media_uri: "Media URI here",
                entry_ids: ['MediaID'],
            }
        };

        // mock the response
        const res = {
            user: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };

        // call the function
        await addMedia(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that the response was an ObjectId
        let response = JSON.parse(response_json);

        // check that the response was an ObjectId
        let id: ObjectId | null;
        try {
            id = new ObjectId(response);
            // temp_user_id = id;
        }
        catch (err) {
            id = null;
        }
        expect(id).toBeInstanceOf(ObjectId);
    }
    );


    test('responds to GET /media/:id', async () => {
        // create a variable to store the response
        let user_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            user_json = send.mock.calls[0][0];
        });

        // mock the request object
        const req = {
            params: {
                id: temp_user_id
            }
        };

        // mock the response
        const res = {
            user: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };

        // call the function
        await getMedia(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(user_json);
        expect(response).toBeInstanceOf(Object);
    }
    );

    test('responds to PUT /media/:id', async () => {
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
                id: "Test Media ID"
            },
            body: {
                location: "Somewhere",
                tags: ['test'],
                media_uri: "Media URI here",
                entry_ids: ['MediaID']
            }
        
        };

        // mock the response
        const res = {
            user: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };

        // call the function
        await updateMedia(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        expect(response).toBeInstanceOf(Object);
    }
    );


    test('responds to DELETE /media/:id', async () => {
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
                id: "Delete Test",
            }
        };

        // mock the response
        const res = {
            user: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };

        // call the function
        await deleteMedia(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that one media item was deleted
        let response = JSON.parse(response_json);
        expect(response).toBe(1);
    }
    );

});

// import { ObjectId } from 'mongodb';
// import { getAllGoals as getAllMedia, getGoal as getMedia, addGoal as addMedia, updateGoal as updateMedia, deleteGoal as deleteMedia} from '../../controllers/goals';

// let temp_media_id = new ObjectId(1).toString();
// describe('Media', () => {

//     test('responds to GET /media', async () => {
//         // create a variable to store the response
//         let media_json = "";

//         // mock the send function
//         const send = jest.fn().mockImplementation(() => {
//             media_json = send.mock.calls[0][0];
//         });

//         // mock the request object
//         const req = {};

//         // mock the response
//         const res = {
//             users: null,
//             setHeader: jest.fn(),
//             status: jest.fn().mockReturnValue({
//                 send: send
//             }),
//             send: send
//         };

//         // call the function
//         await getMedia(req, res);

//         // check the response
//         expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(send).toHaveBeenCalled();
//         let response = JSON.parse(media_json);
//         expect(response).toBeInstanceOf(Object);

//         temp_media_id = response[0]._id;
//     });


//     test('responds to POST /media', async () => {
//         // create a variable to store the response
//         let response_json = "";

//         // mock the send function
//         const send = jest.fn().mockImplementation(() => {
//             response_json = send.mock.calls[0][0];
//         }
//         );
//         // mock the request object
//         const req = {
//             body: {
//                 name: "Test Media"
//             }
//         };

//         // mock the response
//         const res = {
//             user: null,
//             setHeader: jest.fn(),
//             status: jest.fn().mockReturnValue({
//                 send: send
//             }),
//             send: send
//         };

//         // call the function
//         await addMedia(req, res);

//         // check the response
//         expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(send).toHaveBeenCalled();

//         // check that the response was an ObjectId
//         let response = JSON.parse(response_json);

//         // check that the response was an ObjectId
//         let id: ObjectId | null;
//         try {
//             id = new ObjectId(response);
//             // temp_media_id = id;
//         }
//         catch (err) {
//             id = null;
//         }
//         expect(id).toBeInstanceOf(ObjectId);
//     }
//     );


//     test('responds to GET /media/:id', async () => {
//         // create a variable to store the response
//         let user_json = "";

//         // mock the send function
//         const send = jest.fn().mockImplementation(() => {
//             user_json = send.mock.calls[0][0];
//         });

//         // mock the request object
//         const req = {
//             params: {
//                 id: temp_media_id
//             }
//         };

//         // mock the response
//         const res = {
//             user: null,
//             setHeader: jest.fn(),
//             status: jest.fn().mockReturnValue({
//                 send: send
//             }),
//             send: send
//         };

//         // call the function
//         await getMedia(req, res);

//         // check the response
//         expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(send).toHaveBeenCalled();
//         let response = JSON.parse(user_json);
//         expect(response).toBeInstanceOf(Object);
//     }
//     );

//     test('responds to PUT /media/:id', async () => {
//         // create a variable to store the response
//         let response_json = "";

//         // mock the send function
//         const send = jest.fn().mockImplementation(() => {
//             response_json = send.mock.calls[0][0];
//         }
//         );
//         // mock the request object
//         const req = {
//             params: {
//                 id: temp_media_id
//             },
//             body: {
//                 name: "Test Media"
//             }
//         };

//         // mock the response
//         const res = {
//             media: null,
//             setHeader: jest.fn(),
//             status: jest.fn().mockReturnValue({
//                 send: send
//             }),
//             send: send
//         };

//         // call the function
//         await updateMedia(req, res);

//         // check the response
//         expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(send).toHaveBeenCalled();

//         // check that the response was an ObjectId
//         let response = JSON.parse(response_json);
//         expect(response).toBeInstanceOf(Object);
//     }
//     );


//     test('responds to DELETE /media/:id', async () => {
//         // create a variable to store the response
//         let response_json = "";

//         // mock the send function
//         const send = jest.fn().mockImplementation(() => {
//             response_json = send.mock.calls[0][0];
//         }
//         );
//         // mock the request object
//         const req = {
//             params: {
//                 id: temp_media_id
//             }
//         };

//         // mock the response
//         const res = {
//             user: null,
//             setHeader: jest.fn(),
//             status: jest.fn().mockReturnValue({
//                 send: send
//             }),
//             send: send
//         };

//         // call the function
//         await deleteMedia(req, res);

//         // check the response
//         expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(send).toHaveBeenCalled();

//         // check that one media was deleted
//         let response = JSON.parse(response_json);
//         expect(response).toBe(1);
//     }
//     );

// });