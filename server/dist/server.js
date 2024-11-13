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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const facultyRoutes_1 = __importDefault(require("./routes/facultyRoutes"));
const adminController_1 = require("./controllers/adminController");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Built-in middleware for parsing JSON
app.use(express_1.default.json({ limit: "30mb" }));
// Built-in middleware for parsing URL-encoded data
app.use(express_1.default.urlencoded({ limit: "30mb", extended: true }));
// Enable CORS
app.use((0, cors_1.default)({
    origin: 'https://universitymanagementsystem.vercel.app', // Allow Vercel frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true // Allow cookies to be sent if needed
}));
// Routes
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/faculty", facultyRoutes_1.default);
app.use("/api/student", studentRoutes_1.default);
// Root route
app.get("/", (req, res) => {
    res.send("Hello to college ERP API");
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running on port ${PORT}`);
    try {
        yield (0, adminController_1.addDummyAdmin)();
    }
    catch (error) {
        console.log("Database connection failed");
    }
}));
