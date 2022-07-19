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
const goals_1 = require("../../controllers/goals");
let temp_goal_id = new mongodb_1.ObjectId(1).toString();
describe('Users', () => {
    test('responds to GET /goals', () => __awaiter(void 0, void 0, void 0, function* () {
        // create a variable to store the response
        let goals_json = "";
        // mock the send function
        const send = jest.fn().mockImplementation(() => {
            goals_json = send.mock.calls[0][0];
        });
        // mock the request object
        const req = {
            oidc: {
                user: {
                    sub: 'Google|23432u432890',
                }
            },
        };
        // mock the response
        const res = {
            users: null,
            setHeader: jest.fn(),
            status: jest.fn().mockReturnValue({
                send: send
            }),
            send: send,
            locals: {
                mongodb: {
                    getDb: () => {
                        return {
                            db: () => {
                                return {
                                    collection: (collectionName) => {
                                        return {
                                            find: jest.fn().mockImplementation((query) => {
                                                return [];
                                            }),
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            }
        };
        // call the function
        yield (0, goals_1.getAllGoals)(req, res);
        // check the response
        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalled();
        let response = JSON.parse(goals_json);
        expect(response).toBeInstanceOf(Array);
    }));
    // test('responds to POST /goal', async () => {
    //     // create a variable to store the response
    //     let response_json = "";
    //     // mock the send function
    //     const send = jest.fn().mockImplementation(() => {
    //         response_json = send.mock.calls[0][0];
    //     }
    //     );
    //     // mock the request object
    //     const req = {
    //         body: {
    //             _id: "new ObjectId(8)",
    //             description: "test goal",
    //             owner_id: "57849375842",
    //             name: 'Second Goal',
    //             createdDate: new Date(),
    //             dueDate: new Date(), 
    //             deletedDate: new Date(),
    //             entry_ids: [
    //                 "new ObjectId(9)",
    //                 "new ObjectId(0)",
    //             ],
    //             media_ids:  [
    //                 "new ObjectId(9)",
    //                 "new ObjectId(0)",
    //             ],
    //         },
    //         oidc: {
    //             user: {
    //                 sub: 'Google|23432u432890',
    //             }
    //         },
    //     };
    //     // mock the response
    //     const res = {
    //         user: null,
    //         setHeader: jest.fn(),
    //         status: jest.fn().mockReturnValue({
    //             send: send
    //         }),
    //         send: send,
    //         locals: {
    //             mongodb: {
    //                 getDb: () => {
    //                     return {
    //                         db: () => {
    //                             return {
    //                                 collection: (collectionName: string) => {
    //                                     return {
    //                                         insertOne: jest.fn().mockImplementation((query, insert) => {
    //                                             if (query._id) {
    //                                                 return {
    //                                                     insertedId: temp_goal_id,
    //                                                 };
    //                                             }
    //                                         })
    //                                     };
    //                                 }
    //                             };
    //                         }
    //                     };
    //                 }
    //             }
    //         }
    //     };
    //     // call the function
    //     await addGoal(req, res);
    //     // check the response
    //     expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    //     expect(send).toHaveBeenCalled();
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     // check that the response was an ObjectId
    //     // let response = JSON.parse(response_json);
    //     // // check that the response was an ObjectId
    //     // let id: ObjectId | null;
    //     // try {
    //     //     id = new ObjectId(response);
    //     //     // temp_goal_id = id;
    //     // }
    //     // catch (err) {
    //     //     id = null;
    //     // }
    //     // expect(id).toBeInstanceOf(ObjectId);
    // }
    // );
    // test('responds to GET /goals/:id', async () => {
    //     // create a variable to store the response
    //     let user_json = "";
    //     // mock the send function
    //     const send = jest.fn().mockImplementation(() => {
    //         user_json = send.mock.calls[0][0];
    //     });
    //     // mock the request object
    //     const req = {
    //         params: {
    //             id: temp_goal_id
    //         }
    //     };
    //     // mock the response
    //     const res = {
    //         user: null,
    //         setHeader: jest.fn(),
    //         status: jest.fn().mockReturnValue({
    //             send: send
    //         }),
    //         send: send
    //     };
    //     // call the function
    //     await getGoal(req, res);
    //     // check the response
    //     expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(send).toHaveBeenCalled();
    //     let response = JSON.parse(user_json);
    //     expect(response).toBeInstanceOf(Object);
    // }
    // );
    // test('responds to PUT /goals/:id', async () => {
    //     // create a variable to store the response
    //     let response_json = "";
    //     // mock the send function
    //     const send = jest.fn().mockImplementation(() => {
    //         response_json = send.mock.calls[0][0];
    //     }
    //     );
    //     // mock the request object
    //     const req = {
    //         params: {
    //             id: temp_goal_id
    //         },
    //         body: {
    //             name: "Test Goal"
    //         }
    //     };
    //     // mock the response
    //     const res = {
    //         goal: null,
    //         setHeader: jest.fn(),
    //         status: jest.fn().mockReturnValue({
    //             send: send
    //         }),
    //         send: send
    //     };
    //     // call the function
    //     await updateGoal(req, res);
    //     // check the response
    //     expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(send).toHaveBeenCalled();
    //     // check that the response was an ObjectId
    //     let response = JSON.parse(response_json);
    //     expect(response).toBeInstanceOf(Object);
    // }
    // );
    // test('responds to DELETE /goal/:id', async () => {
    //     // create a variable to store the response
    //     let response_json = "";
    //     // mock the send function
    //     const send = jest.fn().mockImplementation(() => {
    //         response_json = send.mock.calls[0][0];
    //     }
    //     );
    //     // mock the request object
    //     const req = {
    //         params: {
    //             id: temp_goal_id
    //         }
    //     };
    //     // mock the response
    //     const res = {
    //         user: null,
    //         setHeader: jest.fn(),
    //         status: jest.fn().mockReturnValue({
    //             send: send
    //         }),
    //         send: send
    //     };
    //     // call the function
    //     await deleteGoal(req, res);
    //     // check the response
    //     expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(send).toHaveBeenCalled();
    //     // check that one goal was deleted
    //     let response = JSON.parse(response_json);
    //     expect(response).toBe(1);
    // }
    // );
});
