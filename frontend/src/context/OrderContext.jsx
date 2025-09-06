import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const createOrder = useCallback(async data => {
    setLoading(true);
    try {
      const { data: order } = await api.post('/orders', data);
      setOrders(prev => [order, ...prev]);
      return order;
    } finally { setLoading(false); }
  }, []);

  const getMyOrders = useCallback(async (page=1, limit=10) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/myorders?page=${page}&limit=${limit}`);
      setOrders(data.orders);
      return data;
    } finally { setLoading(false); }
  }, []);

  const getOrderById = useCallback(async id => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}`);
      setCurrentOrder(data);
      return data;
    } finally { setLoading(false); }
  }, []);

  const getOrderStats = useCallback(async () => {
    const { data } = await api.get('/orders/stats');
    setOrderStats(data);
    return data;
  }, []);

  const cancelOrder = useCallback(async id => {
    const { data } = await api.put(`/orders/${id}/cancel`);
    setOrders(prev => prev.map(o => o._id===id?{...o,orderStatus:'Cancelled'}:o));
    return data;
  }, []);

  const updateOrderToPaid = useCallback(async (id, result) => {
    const { data } = await api.put(`/orders/${id}/pay`, result);
    setOrders(prev => prev.map(o => o._id===id?{...o,...data}:o));
    return data;
  }, []);

  return (
    <OrderContext.Provider value={{
      orders, orderStats, currentOrder, loading,
      createOrder, getMyOrders, getOrderById, getOrderStats,
      cancelOrder, updateOrderToPaid
    }}>
      {children}
    </OrderContext.Provider>
  );
};

OrderProvider.propTypes = { children: PropTypes.node.isRequired };
