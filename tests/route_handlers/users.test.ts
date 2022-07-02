import { ObjectId } from 'mongodb';
import {getAllUsers, getUser, addUser, updateUser, deleteUser} from '../../controllers/users';

describe('Users', () => {

    test('responds to /users', async () => {
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
    });

    test('responds to /users/:id', async () => {
        // create a variable to store the response
        let user_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            user_json = send.mock.calls[0][0];
        });

        // mock the request object
        const req = {
            params: {
                id: new ObjectId()
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

});