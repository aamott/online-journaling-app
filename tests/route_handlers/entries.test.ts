import { ObjectId } from 'mongodb';
import {getAllEntries, getEntry,  addEntry, updateEntry,  deleteEntry} from '../../controllers/entries';

let temp_entry_id = new ObjectId(1).toString();
describe('Users', () => {

    test('responds to GET /entries', async () => {
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
            users: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };

        // call the function
        await getAllEntries(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(entries_json);
        expect(response).toBeInstanceOf(Array);

        temp_entry_id = response[0]._id;
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
                name: "Test Entry"
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
        await addEntry(req, res);

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
            // temp_entry_id = id;
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
                id: temp_entry_id
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
        await updateEntry(req, res);

        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();

        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        expect(response).toBeInstanceOf(Object);
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