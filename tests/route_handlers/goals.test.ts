import { ObjectId } from 'mongodb';
import { getAllGoals, getGoal, addGoal, updateGoal, deleteGoal} from '../../controllers/goals';

let temp_goal_id = new ObjectId(1).toString();
describe('Users', () => {

    test('responds to GET /entries', async () => {
        // create a variable to store the response
        let goals_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            goals_json = send.mock.calls[0][0];
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
        await getAllGoals(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(goals_json);
        expect(response).toBeInstanceOf(Array);

        temp_goal_id = response[0]._id;
    });


    test('responds to POST /goal', async () => {
        // create a variable to store the response
        let response_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        }
        );
        // mock the request object
        const req = {
                _id: "new ObjectId(8)",
                name: 'Second Goal',
                createdDate: new Date(),
                dueDate: new Date(), 
                deletedDate: new Date(),
                entry_ids: [
                   "new ObjectId(9)",
                   "new ObjectId(0)",
                ],
                media_ids:  [
                   "new ObjectId(9)",
                   "new ObjectId(0)",
                ],
            
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
        await addGoal(req, res);

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
            // temp_goal_id = id;
        }
        catch (err) {
            id = null;
        }
        expect(id).toBeInstanceOf(ObjectId);
    }
    );


    test('responds to GET /goals/:id', async () => {
        // create a variable to store the response
        let user_json = "";

        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            user_json = send.mock.calls[0][0];
        });

        // mock the request object
        const req = {
            params: {
                id: temp_goal_id
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
        await getGoal(req, res);

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
                id: temp_goal_id
            },
            body: {
                name: "Test Goal"
            }
        };

        // mock the response
        const res = {
            goal: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };

        // call the function
        await updateGoal(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        expect(response).toBeInstanceOf(Object);
    }
    );


    test('responds to DELETE /goal/:id', async () => {
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
                id: temp_goal_id
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
        await deleteGoal(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that one goal was deleted
        let response = JSON.parse(response_json);
        expect(response).toBe(1);
    }
    );

});