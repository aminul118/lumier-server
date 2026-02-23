import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IColor } from './color.interface';
import { Color } from './color.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createColorIntoDB = async (payload: IColor) => {
  const result = await Color.create(payload);
  return result;
};

const getAllColorsFromDB = async (query: Record<string, string>) => {
  const colorQuery = new QueryBuilder(Color.find({ isDeleted: false }), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await colorQuery.build();
  const meta = await colorQuery.getMeta();

  return {
    meta,
    result,
  };
};

const getSingleColorFromDB = async (id: string) => {
  const result = await Color.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Color not found');
  }
  return result;
};

const updateColorIntoDB = async (id: string, payload: Partial<IColor>) => {
  const result = await Color.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Color not found');
  }
  return result;
};

const deleteColorFromDB = async (id: string) => {
  const result = await Color.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Color not found');
  }
  return result;
};

export const ColorServices = {
  createColorIntoDB,
  getAllColorsFromDB,
  getSingleColorFromDB,
  updateColorIntoDB,
  deleteColorFromDB,
};
