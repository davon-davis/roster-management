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
exports.peopleRouter = void 0;
const express_1 = require("express");
const peopleService_1 = require("../services/peopleService");
const peopleRouter = () => {
    const peopleRouter = (0, express_1.Router)();
    peopleRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const people = yield (0, peopleService_1.peopleService)();
            res.json(people);
        }
        catch (error) {
            res.status(500).send("Error fetching people data");
        }
    }));
    return peopleRouter;
};
exports.peopleRouter = peopleRouter;
