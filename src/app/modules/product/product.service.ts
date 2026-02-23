import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createProductIntoDB = async (payload: IProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, string>) => {
  const productQuery = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query,
  )
    .search(['name', 'category', 'subCategory', 'type', 'description'])
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

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id);
  if (!result || result.isDeleted) {
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
