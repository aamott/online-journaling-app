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
const goals_1 = require("../../controllers/users");
let temp_goals_id = new mongodb_1.ObjectId(1);
describe('Goals', () => {
    test('responds to GET /goals', () => __awaiter(void 0, void 0, void 0, function* () {
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
            goals: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send
        };
        // call the function
        yield (0, goals_1.getAllGoals)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(goals_json);
        expect(response).toBeInstanceOf(Array);
        temp_goals_id = response[0]._id;
    }));
    test('responds to POST /goals', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
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
        yield (0, goals_1.addGoal)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        // check that the response was an ObjectId
        let id;
        try {
            id = new mongodb_1.ObjectId(response);
            // temp_goal_id = id;
        }
        catch (err) {
            id = null;
        }
        expect(id).toBeInstanceOf(mongodb_1.ObjectId);
    }));
    test('responds to GET /goals/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let goal_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            goal_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_goal_id
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
        yield (0, goals_1.getGoal)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(goal_json);
        expect(response).toBeInstanceOf(Object);
    }));
    test('responds to PUT /goals/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
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
        yield (0, goals_1.updateGoal)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        // check that the response was an ObjectId
        let response = JSON.parse(response_json);
        expect(response).toBeInstanceOf(Object);
    }));
    test('responds to DELETE /goals/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let response_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            response_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: temp_goal_id
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
        yield (0, goals_1.deleteGoal)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        // check that one goal was deleted
        let response = JSON.parse(response_json);
        expect(response).toBe(1);
    }));
});
