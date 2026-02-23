import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IHeroBanner, IMiniBanner } from './hero-banner.interface';
import { HeroBanner, MiniBanner } from './hero-banner.model';
import { QueryBuilder } from '../../utils/QueryBuilder';

// ─── Hero Banner Services ─────────────────────────────────────────────────────

const createHeroBannerIntoDB = async (payload: IHeroBanner) => {
  return await HeroBanner.create(payload);
};

const getAllHeroBannersFromDB = async (query: Record<string, string>) => {
  const bannerQuery = new QueryBuilder(
    HeroBanner.find({ isDeleted: false }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bannerQuery.build();
  const meta = await bannerQuery.getMeta();
  return { meta, result };
};

const getSingleHeroBannerFromDB = async (id: string) => {
  const result = await HeroBanner.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Hero banner not found');
  }
  return result;
};

const updateHeroBannerIntoDB = async (
  id: string,
  payload: Partial<IHeroBanner>,
) => {
  const result = await HeroBanner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Hero banner not found');
  }
  return result;
};

const deleteHeroBannerFromDB = async (id: string) => {
  const result = await HeroBanner.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Hero banner not found');
  }
  return result;
};

// ─── Mini Banner Services ─────────────────────────────────────────────────────

const createMiniBannerIntoDB = async (payload: IMiniBanner) => {
  return await MiniBanner.create(payload);
};

const getAllMiniBannersFromDB = async (query: Record<string, string>) => {
  const bannerQuery = new QueryBuilder(
    MiniBanner.find({ isDeleted: false }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bannerQuery.build();
  const meta = await bannerQuery.getMeta();
  return { meta, result };
};

const getSingleMiniBannerFromDB = async (id: string) => {
  const result = await MiniBanner.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Mini banner not found');
  }
  return result;
};

const updateMiniBannerIntoDB = async (
  id: string,
  payload: Partial<IMiniBanner>,
) => {
  const result = await MiniBanner.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Mini banner not found');
  }
  return result;
};

const deleteMiniBannerFromDB = async (id: string) => {
  const result = await MiniBanner.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Mini banner not found');
  }
  return result;
};

export const HeroBannerServices = {
  createHeroBannerIntoDB,
  getAllHeroBannersFromDB,
  getSingleHeroBannerFromDB,
  updateHeroBannerIntoDB,
  deleteHeroBannerFromDB,
};

export const MiniBannerServices = {
  createMiniBannerIntoDB,
  getAllMiniBannersFromDB,
  getSingleMiniBannerFromDB,
  updateMiniBannerIntoDB,
  deleteMiniBannerFromDB,
};
