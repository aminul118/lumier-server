import { User } from '../user/user.model';
import { IsActive } from '../user/user.interface';
import { Product } from '../product/product.model';
import { Order } from '../order/order.model';
import { OrderStatus } from '../order/order.interface';

const getAdminStats = async () => {
  const [
    userCount,
    productCount,
    orderCount,
    userStatusAgg,
    orderStatusAgg,
    totalSalesAgg,
  ] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Product.estimatedDocumentCount(),
    Order.countDocuments({ isDeleted: false }),

    // user status distribution
    User.aggregate([
      {
        $facet: {
          statusCounts: [
            {
              $match: { isDeleted: false },
            },
            {
              $group: {
                _id: '$isActive',
                count: { $sum: 1 },
              },
            },
          ],
          deletedCount: [
            {
              $match: { isDeleted: true },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]),

    // order status distribution
    Order.aggregate([
      {
        $group: { _id: '$status', count: { $sum: 1 } },
      },
    ]),

    // financial stats
    Order.aggregate([
      {
        $match: { status: { $ne: OrderStatus.CANCELLED } },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $addFields: {
          productDetail: { $arrayElemAt: ['$productDetails', 0] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' }, // This counts total order price (which might include discounts)
          totalCost: {
            $sum: { $multiply: ['$items.quantity', '$productDetail.buyPrice'] },
          },
        },
      },
    ]),

    // Inventory stats
    Product.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $group: {
          _id: null,
          totalStockValue: { $sum: { $multiply: ['$stock', '$buyPrice'] } },
          totalStockCount: { $sum: '$stock' },
          lowStockCount: {
            $sum: { $cond: [{ $lt: ['$stock', 5] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const financialStats = totalSalesAgg[0] || { totalRevenue: 0, totalCost: 0 };
  const inventoryStats = userStatusAgg[1] || {
    totalStockValue: 0,
    totalStockCount: 0,
    lowStockCount: 0,
  };

  // Format order status counts
  const orderStatusDistribution = orderStatusAgg.reduce(
    (acc: Record<string, number>, curr: { _id: string; count: number }) => {
      acc[curr._id] = curr.count;
      return acc;
    },
    { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 },
  );

  // Format user status counts
  const userStats = userStatusAgg[0];
  const userStatusDistribution = userStats.statusCounts.reduce(
    (acc: Record<string, number>, curr: { _id: IsActive; count: number }) => {
      acc[curr._id] = curr.count;
      return acc;
    },
    { ACTIVE: 0, INACTIVE: 0, BLOCKED: 0 },
  );

  const data = {
    user: {
      totalCount: userCount,
      activeCount: userStatusDistribution.ACTIVE,
      inactiveCount: userStatusDistribution.INACTIVE,
      blockedCount: userStatusDistribution.BLOCKED,
      deletedCount: userStats.deletedCount[0]?.count || 0,
    },
    productCount: productCount || 0,
    orderCount: orderCount || 0,
    totalSales: financialStats.totalRevenue || 0,
    totalRevenue: financialStats.totalRevenue || 0,
    totalCost: financialStats.totalCost || 0,
    totalProfit:
      (financialStats.totalRevenue || 0) - (financialStats.totalCost || 0),
    totalStockValue: inventoryStats.totalStockValue || 0,
    lowStockCount: inventoryStats.lowStockCount || 0,
    orderStatusDistribution,
    projectCount: 0,
    blogCount: 0,
    invoice: {
      totalCount: 0,
      totalEarnings: 0,
      totalDue: 0,
      statusDistribution: { PAID: 0, UNPAID: 0, PENDING: 0 },
    },
  };

  return data;
};

export const statsServices = {
  getAdminStats,
};
