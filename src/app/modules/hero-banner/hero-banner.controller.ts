import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HeroBannerServices, MiniBannerServices } from './hero-banner.service';

// ─── Hero Banner Controllers ──────────────────────────────────────────────────

const createHeroBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroBannerServices.createHeroBannerIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Hero banner created successfully',
    data: result,
  });
});

const getAllHeroBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroBannerServices.getAllHeroBannersFromDB(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Hero banners retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleHeroBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroBannerServices.getSingleHeroBannerFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Hero banner retrieved successfully',
    data: result,
  });
});

const updateHeroBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroBannerServices.updateHeroBannerIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Hero banner updated successfully',
    data: result,
  });
});

const deleteHeroBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await HeroBannerServices.deleteHeroBannerFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Hero banner deleted successfully',
    data: result,
  });
});

// ─── Mini Banner Controllers ──────────────────────────────────────────────────

const createMiniBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await MiniBannerServices.createMiniBannerIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Mini banner created successfully',
    data: result,
  });
});

const getAllMiniBanners = catchAsync(async (req: Request, res: Response) => {
  const result = await MiniBannerServices.getAllMiniBannersFromDB(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mini banners retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleMiniBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await MiniBannerServices.getSingleMiniBannerFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mini banner retrieved successfully',
    data: result,
  });
});

const updateMiniBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await MiniBannerServices.updateMiniBannerIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mini banner updated successfully',
    data: result,
  });
});

const deleteMiniBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await MiniBannerServices.deleteMiniBannerFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mini banner deleted successfully',
    data: result,
  });
});

export const HeroBannerControllers = {
  createHeroBanner,
  getAllHeroBanners,
  getSingleHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
};

export const MiniBannerControllers = {
  createMiniBanner,
  getAllMiniBanners,
  getSingleMiniBanner,
  updateMiniBanner,
  deleteMiniBanner,
};
