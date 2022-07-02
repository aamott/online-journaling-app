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
const users_1 = require("../../controllers/users");
describe('Users', () => {
    test('responds to /users', () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield (0, users_1.getAllUsers)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(users_json);
        expect(response).toBeInstanceOf(Array);
    }));
    test('responds to /users/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let user_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            user_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            params: {
                id: new mongodb_1.ObjectId()
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
        yield (0, users_1.getUser)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(user_json);
        expect(response).toBeInstanceOf(Object);
    }));
});
