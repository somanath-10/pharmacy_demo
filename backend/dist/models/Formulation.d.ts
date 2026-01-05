import mongoose, { Document } from 'mongoose';
interface IIngredient {
    materialName: string;
    amountRequired: number;
}
export interface IFormulation extends Document {
    medicineName: string;
    ingredients: IIngredient[];
}
declare const _default: mongoose.Model<IFormulation, {}, {}, {}, mongoose.Document<unknown, {}, IFormulation, {}, mongoose.DefaultSchemaOptions> & IFormulation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IFormulation>;
export default _default;
//# sourceMappingURL=Formulation.d.ts.map