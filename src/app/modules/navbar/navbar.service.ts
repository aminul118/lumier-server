import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { INavItem } from './navbar.interface';
import { Navbar } from './navbar.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createNavbarIntoDB = async (payload: INavItem) => {
  const result = await Navbar.create(payload);
  return result;
};

const getAllNavbarsFromDB = async (query: Record<string, string>) => {
  const navbarQuery = new QueryBuilder(Navbar.find({ isDeleted: false }), query)
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await navbarQuery.build();
  const meta = await navbarQuery.getMeta();

  return {
    meta,
    result,
  };
};

const getSingleNavbarFromDB = async (id: string) => {
  const result = await Navbar.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Navbar item not found');
  }
  return result;
};

const updateNavbarIntoDB = async (id: string, payload: Partial<INavItem>) => {
  const result = await Navbar.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Navbar item not found');
  }
  return result;
};

const deleteNavbarFromDB = async (id: string) => {
  const result = await Navbar.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Navbar item not found');
  }
  return result;
};

export const NavbarServices = {
  createNavbarIntoDB,
  getAllNavbarsFromDB,
  getSingleNavbarFromDB,
  updateNavbarIntoDB,
  deleteNavbarFromDB,
};
