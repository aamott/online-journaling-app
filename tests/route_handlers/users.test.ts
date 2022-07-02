import { ObjectId } from 'mongodb';
import {getAllUsers, getUser, addUser, updateUser, deleteUser} from '../../controllers/users';

let temp_user_id = new ObjectId(1);
describe('Users', () => {

    test('responds to GET /users', async () => {
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
        await getAllUsers(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(users_json);
        expect(response).toBeInstanceOf(Array);

        temp_user_id = response[0]._id;
    });


    test('responds to POST /users', async () => {
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
                name: "Test User"
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
        await addUser(req, res);

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


    test('responds to GET /users/:id', async () => {
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
        await getUser(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(user_json);
        expect(response).toBeInstanceOf(Object);
    }
    );

    test('responds to PUT /users/:id', async () => {
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
                id: temp_user_id
            },
            body: {
                name: "Test User"
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
        await updateUser(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        expect(response).toBeInstanceOf(Object);
    }
    );


    test('responds to DELETE /users/:id', async () => {
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
        await deleteUser(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that one user was deleted
        let response = JSON.parse(response_json);
        expect(response).toBe(1);
    }
    );

});