"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const Medicine_1 = require("../controllers/Medicine");
const router = express.Router();
router.post('/check-availability', Medicine_1.checkAvailability);
router.post('/insert-medicine', Medicine_1.postMedicine);
exports.default = router;
//# sourceMappingURL=route.js.map