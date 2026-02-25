import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ColorServices } from './color.service';

const createColor = catchAsync(async (req: Request, res: Response) => {
  const result = await ColorServices.createColorIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Color created successfully',
    data: result,
  });
});

const getAllColors = catchAsync(async (req: Request, res: Response) => {
  const result = await ColorServices.getAllColorsFromDB(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Colors retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleColor = catchAsync(async (req: Request, res: Response) => {
  const result = await ColorServices.getSingleColorFromDB(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Color retrieved successfully',
    data: result,
  });
});

const updateColor = catchAsync(async (req: Request, res: Response) => {
  const result = await ColorServices.updateColorIntoDB(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Color updated successfully',
    data: result,
  });
});

const deleteColor = catchAsync(async (req: Request, res: Response) => {
  const result = await ColorServices.deleteColorFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Color deleted successfully',
    data: result,
  });
});

export const ColorControllers = {
  createColor,
  getAllColors,
  getSingleColor,
  updateColor,
  deleteColor,
};
