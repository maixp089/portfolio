"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const portfolio_1 = __importDefault(require("./routes/portfolio"));
const skill_1 = __importDefault(require("./routes/skill"));
const contact_1 = __importDefault(require("./routes/contact"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/portfolios", portfolio_1.default);
app.use("/api/skills", skill_1.default);
app.use("/api/contacts", contact_1.default);
app.use('/uploads', express_1.default.static('uploads'));
app.listen(4000, () => {
    console.log("APIサーバー起動中！");
});
