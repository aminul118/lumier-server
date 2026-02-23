import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NavbarServices } from './navbar.service';

const createNavbar = catchAsync(async (req: Request, res: Response) => {
  const result = await NavbarServices.createNavbarIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Navbar item created successfully',
    data: result,
  });
});

const getAllNavbars = catchAsync(async (req: Request, res: Response) => {
  const result = await NavbarServices.getAllNavbarsFromDB(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Navbar items retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleNavbar = catchAsync(async (req: Request, res: Response) => {
  const result = await NavbarServices.getSingleNavbarFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Navbar item retrieved successfully',
    data: result,
  });
});

const updateNavbar = catchAsync(async (req: Request, res: Response) => {
  const result = await NavbarServices.updateNavbarIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Navbar item updated successfully',
    data: result,
  });
});

const deleteNavbar = catchAsync(async (req: Request, res: Response) => {
  const result = await NavbarServices.deleteNavbarFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Navbar item deleted successfully',
    data: result,
  });
});

export const NavbarControllers = {
  createNavbar,
  getAllNavbars,
  getSingleNavbar,
  updateNavbar,
  deleteNavbar,
};
