import httpStatus from 'http-status-codes';
import { slugify } from 'transliteration';
import AppError from '../../errorHelpers/AppError';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createProductIntoDB = async (payload: IProduct) => {
  if (!payload.slug) {
    payload.slug = slugify(payload.name);
  }
  const result = await Product.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, string>) => {
  const productQuery = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query,
  )
    .search(['name', 'slug', 'category', 'subCategory', 'type', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.build();
  const meta = await productQuery.getMeta();

  return {
    meta,
    result,
  };
};

const getSingleProductFromDB = async (idOrSlug: string) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

  const result = await Product.findOne({ ...query, isDeleted: false });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return result;
};

const updateProductIntoDB = async (id: string, payload: Partial<IProduct>) => {
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
};
