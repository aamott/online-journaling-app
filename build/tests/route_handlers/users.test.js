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
const testUsers = [
    {
        _id: new mongodb_1.ObjectId(),
        name: 'Test User',
        entry_ids: [],
        goal_ids: [],
        media_ids: []
    }
];
describe('Users', () => {
    test('responds to /users', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {};
        // mock the response
        const res = {
            users: null,
            setHeader: jest.fn(),
            // test res.status().send()
            status: jest.fn(() => {
                return {
                    send: jest.fn()
                };
            }),
            send: function (input) {
                this.users = input;
            }
        };
        // call the function
        yield (0, users_1.getAllUsers)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        // expect res.send to have been called with a dictionary of users
        // expect(res.send).toHaveBeenCalledWith(JSON.stringify(testUsers));
    }));
});
