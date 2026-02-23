import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  let filesDict: Record<string, Express.Multer.File[]> = {};

  if (Array.isArray(req.files)) {
    req.files.forEach((file) => {
      if (!filesDict[file.fieldname]) {
        filesDict[file.fieldname] = [];
      }
      filesDict[file.fieldname].push(file);
    });
  } else if (req.files) {
    filesDict = req.files as Record<string, Express.Multer.File[]>;
  }

  // Unified Image and Gallery Handling
  if (Object.keys(filesDict).length > 0) {
    if (filesDict.image?.[0]) {
      req.body.image = filesDict.image[0].path;
    }

    if (filesDict.images && filesDict.images.length > 0) {
      req.body.images = filesDict.images.map((file) => file.path);
    }
  }

  // Parse other potentially stringified arrays/objects from FormData
  ['sizes'].forEach((field) => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        req.body[field] = req.body[field].split(',').filter(Boolean);
      }
    }
  });

  const result = await ProductServices.createProductIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllProductsFromDB(
    req.query as Record<string, string>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getSingleProductFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  let filesDict: Record<string, Express.Multer.File[]> = {};

  if (Array.isArray(req.files)) {
    req.files.forEach((file) => {
      if (!filesDict[file.fieldname]) {
        filesDict[file.fieldname] = [];
      }
      filesDict[file.fieldname].push(file);
    });
  } else if (req.files) {
    filesDict = req.files as Record<string, Express.Multer.File[]>;
  }

  // Unified Image and Gallery Handling
  if (Object.keys(filesDict).length > 0) {
    if (filesDict.image?.[0]) {
      req.body.image = filesDict.image[0].path;
    }

    // General Gallery
    if (filesDict.images && filesDict.images.length > 0) {
      const newImages = filesDict.images.map((file) => file.path);
      let existingImages = [];
      if (req.body.images) {
        try {
          existingImages = JSON.parse(req.body.images);
        } catch {
          existingImages = Array.isArray(req.body.images)
            ? req.body.images
            : [req.body.images];
        }
      }
      req.body.images = [...existingImages, ...newImages];
    } else if (req.body.images) {
      try {
        req.body.images = JSON.parse(req.body.images);
      } catch {
        if (!Array.isArray(req.body.images)) {
          req.body.images = [req.body.images];
        }
      }
    }
  } else {
    // Handle cases with no new files but existing image data
    if (req.body.images) {
      try {
        req.body.images = JSON.parse(req.body.images);
      } catch {
        if (!Array.isArray(req.body.images)) {
          req.body.images = [req.body.images];
        }
      }
    }
  }

  // Parse other potentially stringified arrays/objects
  ['sizes'].forEach((field) => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        req.body[field] = req.body[field].split(',').filter(Boolean);
      }
    }
  });

  const result = await ProductServices.updateProductIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.deleteProductFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
