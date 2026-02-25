import { User } from '../user/user.model';
import { IsActive } from '../user/user.interface';
import { Product } from '../product/product.model';
import { Order } from '../order/order.model';
import { OrderStatus } from '../order/order.interface';

const getAdminStats = async () => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const last7Days = new Date(new Date().setDate(now.getDate() - 7));
  const last15Days = new Date(new Date().setDate(now.getDate() - 15));
  const last30Days = new Date(new Date().setDate(now.getDate() - 30));

  const [
    userCount,
    productCount,
    orderCount,
    userStatusAgg,
    orderStatusAgg,
    financialStatsAgg,
    inventoryStatsAgg,
    timeBasedOrdersAgg,
    revenueTrendAgg,
  ] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Product.countDocuments({ isDeleted: false }),
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
          totalRevenue: { $sum: '$totalPrice' },
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
          totalSaleValue: { $sum: { $multiply: ['$stock', '$price'] } },
          totalStockCount: { $sum: '$stock' },
          lowStockCount: {
            $sum: { $cond: [{ $lt: ['$stock', 5] }, 1, 0] },
          },
        },
      },
    ]),

    // Time-based order counts
    Order.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $facet: {
          today: [
            { $match: { createdAt: { $gte: todayStart } } },
            { $count: 'count' },
          ],
          last7Days: [
            { $match: { createdAt: { $gte: last7Days } } },
            { $count: 'count' },
          ],
          last15Days: [
            { $match: { createdAt: { $gte: last15Days } } },
            { $count: 'count' },
          ],
          last30Days: [
            { $match: { createdAt: { $gte: last30Days } } },
            { $count: 'count' },
          ],
        },
      },
    ]),

    // Revenue trend (last 30 days)
    Order.aggregate([
      {
        $match: {
          isDeleted: false,
          status: { $ne: OrderStatus.CANCELLED },
          createdAt: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const financialStats = financialStatsAgg[0] || {
    totalRevenue: 0,
    totalCost: 0,
  };
  const inventoryStats = inventoryStatsAgg[0] || {
    totalStockValue: 0,
    totalSaleValue: 0,
    totalStockCount: 0,
    lowStockCount: 0,
  };

  const timeBasedOrders = timeBasedOrdersAgg[0];

  // Format order status counts
  const orderStatusDistribution = orderStatusAgg.reduce(
    (acc: Record<string, number>, curr: { _id: string; count: number }) => {
      acc[curr._id] = curr.count;
      return acc;
    },
    { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 },
  );

  // Format user status counts
  const userStatsResult = userStatusAgg[0];
  const userStatusDistribution = userStatsResult.statusCounts.reduce(
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
      deletedCount: userStatsResult.deletedCount[0]?.count || 0,
    },
    productCount: productCount || 0,
    orderCount: orderCount || 0,
    totalSales: financialStats.totalRevenue || 0,
    totalRevenue: financialStats.totalRevenue || 0,
    totalCost: financialStats.totalCost || 0,
    totalProfit:
      (financialStats.totalRevenue || 0) - (financialStats.totalCost || 0),
    totalStockValue: inventoryStats.totalStockValue || 0,
    totalSaleValue: inventoryStats.totalSaleValue || 0,
    lowStockCount: inventoryStats.lowStockCount || 0,
    orderStatusDistribution,
    timeBasedOrders: {
      today: timeBasedOrders.today[0]?.count || 0,
      last7Days: timeBasedOrders.last7Days[0]?.count || 0,
      last15Days: timeBasedOrders.last15Days[0]?.count || 0,
      last30Days: timeBasedOrders.last30Days[0]?.count || 0,
    },
    revenueTrend: revenueTrendAgg.map(
      (item: { _id: string; revenue: number; orders: number }) => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.orders,
      }),
    ),
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
