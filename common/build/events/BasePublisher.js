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
exports.BasePublisher = void 0;
class BasePublisher {
    constructor(client) {
        this.client = client;
    }
    publish(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                //in case of publish failure - nats client will send that error in the err parameter in the callback
                this.client.publish(this.subject, JSON.stringify(data), (err) => {
                    //in case of err - reject
                    if (err)
                        reject(err);
                    //else console and resolve
                    console.log(`Event published - (${this.subject}): `, JSON.stringify(data));
                    resolve();
                });
            });
        });
    }
}
exports.BasePublisher = BasePublisher;
