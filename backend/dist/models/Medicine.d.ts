import mongoose, { Document } from 'mongoose';
export interface IMedicine extends Document {
    name: string;
    stock: number;
    price: number;
    description?: string;
    isPrescriptionRequired: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMedicine, {}, {}, {}, mongoose.Document<unknown, {}, IMedicine, {}, mongoose.DefaultSchemaOptions> & IMedicine & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMedicine>;
export default _default;
//# sourceMappingURL=Medicine.d.ts.map