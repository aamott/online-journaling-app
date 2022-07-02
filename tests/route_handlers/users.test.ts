import { ObjectId } from 'mongodb';
import {getAllUsers, getUser, addUser, updateUser, deleteUser} from '../../controllers/users';

const testUsers = [
    {
        _id: new ObjectId(),
        name: 'Test User',
        entry_ids: [],
        goal_ids: [],
        media_ids: []
    }
];

describe('Users', () => {

    test('responds to /users', async () => {
        const req = {};

        // mock the response
        const res = {
            users: null,
            setHeader: jest.fn(),
            // test res.status().send()
            status: jest.fn(() => {
                return {
                    send: jest.fn()
                }
            }),
            send: function(input: any) {
                this.users = input;
            }
        };

        // call the function
        await getAllUsers(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        // expect res.send to have been called with a dictionary of users
        // expect(res.send).toHaveBeenCalledWith(JSON.stringify(testUsers));
    });

});