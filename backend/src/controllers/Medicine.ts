import { Request, Response } from 'express';
import axios from 'axios';
import Medicine, { IMedicine } from '../models/Medicine';
import Formulation from '../models/Formulation';


export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { medicineName, quantityRequested } = req.body;
    const medicine: IMedicine | null = await Medicine.findOne({ name: medicineName });

    if (!medicine) {
      return res.status(404).json({ 
        available: false, 
        message: "Medicine not found in catalog." 
      });
    }
    if (medicine.stock >= quantityRequested) {
      medicine.stock -= quantityRequested;
      await medicine.save();

      return res.status(200).json({
        available: true,
        message: `Success! ${quantityRequested} units of ${medicineName} sold.`,
        remainingStock: medicine.stock
      });
    }
    else {
      console.log(`[System] Stock low for ${medicineName}. Triggering n8n...`);

      const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/check-raw-materials';

      // Fire and Forget: We don't wait for n8n to finish, we just notify it.
      // We send the medicine name so n8n can look up the Recipe (Formulation).
      axios.post(N8N_WEBHOOK_URL, {
        medicineName: medicine.name,
        currentStock: medicine.stock,
        shortage: quantityRequested - medicine.stock
      }).catch(err => console.error("Failed to trigger n8n:", err.message));

      return res.status(200).json({
        available: false,
        message: `Insufficient stock. Manufacturing protocol initiated for ${medicineName}.`,
        details: "Checking raw materials inventory..."
      });
    }

  } catch (error) {
    return res.status(500).json({ error: "Server Error", details: error });
  }
};

export const createMedicine = async (req: Request, res: Response) => {
  try {
    const { name, stock, price, isPrescriptionRequired,ingredients } = req.body;

    const newMedicine = new Medicine({
      name,
      stock,
      price,
      isPrescriptionRequired
    });

    const formulation = new Formulation({
        medicineName:name,
        ingredients:ingredients
    })

    const savedMedicine = await newMedicine.save();
    await formulation.save();
    return res.status(201).json(savedMedicine);

  } catch (error) {
    return res.status(500).json({ error: "Could not create medicine", details: error });
  }
};



export const updateStock = async (req: Request, res: Response) => {
  try {
    const { medicineName, newStockLevel } = req.body;

    const medicine = await Medicine.findOneAndUpdate(
      { name: medicineName },
      { stock: newStockLevel },
      { new: true } 
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    return res.json({ message: "Stock updated manually", medicine });

  } catch (error) {
    return res.status(500).json({ error: "Update failed" });
  }
};