// utils/orderProcessor.js
export const processPendingOrders = async (orders, dispatch, approveOrder, rejectOrder) => {
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    if (order.price > 0) {
      await dispatch(approveOrder(order._id));
    } else {
      await dispatch(rejectOrder(order._id));
    }
  }
};
