import mongoose, { HydratedDocument, Model } from 'mongoose';
import { ISale, SaleSchema } from './sales.schema';

export type ISaleDocument = HydratedDocument<ISale>;

export const SaleModel: Model<ISale> = mongoose.model<ISale>(
  'Sale',
  SaleSchema
);