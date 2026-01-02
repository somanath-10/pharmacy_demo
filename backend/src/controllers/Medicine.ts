import { Request, Response } from 'express';
import axios from 'axios';
import Medicine, { IMedicine } from '../models/Medicine';
import Formulation, { IFormulation } from '../models/Formulation';
import RawMaterial, { IRawMaterial } from '../models/RawMaterial';

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { medicineName, quantityRequested } = req.body;
    const medicine = await Medicine.findOne({ name: medicineName });

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

    const recipe = await Formulation.findOne({ medicineName: medicineName });
    
    if (!recipe) {
      return res.status(400).json({ message: "Out of stock and no formulation found to make more." });
    }

    let canManufacture = true;
    const missingMaterials: any[] = [];

    for (const ingredient of recipe.ingredients) {
      
      const rawMaterial = await RawMaterial.findOne({ name: ingredient.materialName });

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

        await axios.post('http://localhost:5678/webhook-test/start-production', {
            medicine: medicineName,
            quantity: quantityRequested
        });

        return res.json({
            status: "Production_Started",
            available: false,
            message: "Out of stock, but raw materials are available. Production initiated."
        });

    } else {
        await axios.post('http://localhost:5678/webhook-test/order-raw-materials', {
            medicine: medicineName,
            missingList: missingMaterials 
        })

        return res.json({
            status: "Procurement_Started",
            available: false,
            message: "Out of stock and missing raw materials. Suppliers have been contacted.",
            missingIngredients: missingMaterials
        });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};