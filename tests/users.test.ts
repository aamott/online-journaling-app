import { ObjectId } from 'mongodb';
import {getAllUsers, getUser, addUser, updateUser, deleteUser} from '../controllers/users';

const testUsers = [
    {
        _id: new ObjectId(),
        name: 'Test User',
        entry_ids: [],
        goal_ids: [],
        media_ids: []
    }
];


test('getAllUsers', async () => {
    const req = {};
    const res = {
        setHeader: jest.fn(),
        status: jest.fn(),
        send: jest.fn()
    };
    await getAllUsers(req, res);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(res.status).toHaveBeenCalledWith(200);
    // expect res.send to have been called with a dictionary of users
    // expect(res.send).toHaveBeenCalledWith(JSON.stringify(testUsers));
    // check that the response matches the format of the test data
    expect(res.send).toHaveBeenCalledWith(JSON.stringify(testUsers));
});