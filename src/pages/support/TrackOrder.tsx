import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrderData({
        id: orderId,
        status: 'Processing',
        date: '2024-05-20',
        items: ['Retinol Serum', 'Vitamin C Serum']
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTrack} disabled={!orderId || loading}>
                {loading ? 'Tracking...' : 'Track Order'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {orderData && (
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-semibold">{orderData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-blue-600">{orderData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Date:</span>
                  <span>{orderData.date}</span>
                </div>
                <div>
                  <span>Items:</span>
                  <ul className="mt-2 space-y-1">
                    {orderData.items.map((item: string, index: number) => (
                      <li key={index} className="ml-4">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
