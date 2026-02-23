import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createCategoryIntoDB = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategoriesFromDB = async (query: Record<string, string>) => {
  const categoryQuery = new QueryBuilder(
    Category.find({ isDeleted: false }),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.build();
  const meta = await categoryQuery.getMeta();

  return {
    meta,
    result,
  };
};

const getSingleCategoryFromDB = async (id: string) => {
  const result = await Category.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return result;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<ICategory>,
) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const result = await Category.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
