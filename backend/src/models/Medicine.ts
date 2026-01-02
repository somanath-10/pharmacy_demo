import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  stock: number;
  price: number;
  description?: string;
  isPrescriptionRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  stock: { 
    type: Number, 
    default: 0 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  isPrescriptionRequired: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);