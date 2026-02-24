import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SiteSettingServices } from './site-setting.service';

const getSiteSetting = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteSettingServices.getSiteSettingFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Site settings fetched successfully',
    data: result,
  });
});

const updateSiteSetting = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  if (req.file) {
    payload.logo = req.file.path;
  }

  if (typeof payload.socialLinks === 'string') {
    payload.socialLinks = JSON.parse(payload.socialLinks);
  }

  const result = await SiteSettingServices.updateSiteSettingIntoDB(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Site settings updated successfully',
    data: result,
  });
});

export const SiteSettingControllers = {
  getSiteSetting,
  updateSiteSetting,
};
