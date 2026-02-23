import { model, Schema } from 'mongoose';
import { IColor } from './color.interface';

const colorSchema = new Schema<IColor>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    hex: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Color = model<IColor>('Color', colorSchema);

export { Color };
