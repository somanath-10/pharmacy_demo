"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMedicine = exports.checkAvailability = void 0;
const axios_1 = __importDefault(require("axios"));
const Medicine_1 = __importDefault(require("../models/Medicine"));
const Formulation_1 = __importDefault(require("../models/Formulation"));
const RawMaterial_1 = __importDefault(require("../models/RawMaterial"));
const checkAvailability = async (req, res) => {
    try {
        const { medicineName, quantityRequested } = req.body;
        const medicine = await Medicine_1.default.findOne({ name: medicineName });
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found in catalog." });
        }
        if (medicine.stock >= quantityRequested) {
            medicine.stock -= quantityRequested;
            await medicine.save();
            return res.status(200).json({
                status: "Sold",
                message: "Medicine is available and has been dispensed."
            });
        }
        console.log("Stock low. Checking manufacturing capability...");
        const recipe = await Formulation_1.default.findOne({ medicineName: medicineName });
        if (!recipe) {
            return res.status(400).json({ message: "Out of stock and no formulation found to make more." });
        }
        let canManufacture = true;
        const missingMaterials = [];
        for (const ingredient of recipe.ingredients) {
            const rawMaterial = await RawMaterial_1.default.findOne({ name: ingredient.materialName });
            // Calculate total needed (Amount per unit * Quantity of Medicine requested)
            const totalNeeded = ingredient.amountRequired * quantityRequested;
            if (!rawMaterial || rawMaterial.currentStock < totalNeeded) {
                canManufacture = false;
                missingMaterials.push({
                    name: ingredient.materialName,
                    needed: totalNeeded,
                    available: rawMaterial ? rawMaterial.currentStock : 0,
                    supplier: rawMaterial ? rawMaterial.supplierEmail : "Unknown"
                });
            }
        }
        if (canManufacture) {
            await axios_1.default.post('http://localhost:5678/webhook-test/start-production', {
                medicine: medicineName,
                quantity: quantityRequested
            });
            return res.json({
                status: "Production_Started",
                available: false,
                message: "Out of stock, but raw materials are available. Production initiated."
            });
        }
        else {
            await axios_1.default.post('http://localhost:5678/webhook-test/order-raw-materials', {
                medicine: medicineName,
                missingList: missingMaterials
            });
            return res.json({
                status: "Procurement_Started",
                available: false,
                message: "Out of stock and missing raw materials. Suppliers have been contacted.",
                missingIngredients: missingMaterials
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
};
exports.checkAvailability = checkAvailability;
const postMedicine = async (req, res) => {
    try {
        const { name, stock, price, description, isPrescriptionRequired } = req.body;
        const newMedicine = new Medicine_1.default({
            name,
            stock,
            price,
            description,
            isPrescriptionRequired
        });
        const savedMedicine = await newMedicine.save();
        return res.status(201).json(savedMedicine);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server Error" });
    }
};
exports.postMedicine = postMedicine;
//# sourceMappingURL=Medicine.js.map