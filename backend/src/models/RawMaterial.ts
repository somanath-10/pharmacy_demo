import mongoose, { Schema, Document } from 'mongoose';

export interface IRawMaterial extends Document {
  name: string;
  currentStock: number;
  unit: string;
  supplierEmail: string;
  costPerUnit?: number;
}

const RawMaterialSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  currentStock: { 
    type: Number, 
    default: 0,
    min: 0
  },
  unit: { 
    type: String, 
    default: 'mg'
  },
  supplierEmail: { 
    type: String, 
    required: true 
  },
  costPerUnit: { 
    type: Number 
  }
});

export default mongoose.model<IRawMaterial>('RawMaterial', RawMaterialSchema);