import mongoose, { Document } from 'mongoose';
export interface IRawMaterial extends Document {
    name: string;
    currentStock: number;
    unit: string;
    supplierEmail: string;
    costPerUnit?: number;
}
declare const _default: mongoose.Model<IRawMaterial, {}, {}, {}, mongoose.Document<unknown, {}, IRawMaterial, {}, mongoose.DefaultSchemaOptions> & IRawMaterial & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRawMaterial>;
export default _default;
//# sourceMappingURL=RawMaterial.d.ts.map