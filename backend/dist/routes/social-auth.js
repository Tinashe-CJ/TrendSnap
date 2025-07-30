"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Social auth routes are working',
        availableProviders: ['google', 'facebook', 'apple']
    });
});
router.get('/google', (req, res) => {
    res.json({
        success: true,
        message: 'Google OAuth endpoint ready',
        note: 'OAuth configuration required'
    });
});
router.get('/facebook', (req, res) => {
    res.json({
        success: true,
        message: 'Facebook OAuth endpoint ready',
        note: 'OAuth configuration required'
    });
});
router.get('/apple', (req, res) => {
    res.json({
        success: true,
        message: 'Apple OAuth endpoint ready',
        note: 'OAuth configuration required'
    });
});
exports.default = router;
//# sourceMappingURL=social-auth.js.map