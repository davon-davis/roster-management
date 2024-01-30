"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const peopleRouter_1 = require("./routers/peopleRouter");
const app = (0, express_1.default)();
const port = 3002; // Make sure this port doesn't conflict with your Next.js port
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/people", (0, peopleRouter_1.peopleRouter)());
app.get("/", (req, res) => {
    res.send("Hello World from Node.js backend!");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
