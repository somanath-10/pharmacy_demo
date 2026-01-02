import mongoose, { Schema, Document } from 'mongoose';

interface IIngredient {
  materialName: string;
  amountRequired: number;
}

export interface IFormulation extends Document {
  medicineName: string;
  ingredients: IIngredient[];
}

const FormulationSchema: Schema = new Schema({
  medicineName: { 
    type: String, 
    required: true,
    ref: 'Medicine' 
  },
  ingredients: [
    {
      materialName: { type: String, required: true },
      amountRequired: { type: Number, required: true }
    }
  ]
});

export default mongoose.model<IFormulation>('Formulation', FormulationSchema);