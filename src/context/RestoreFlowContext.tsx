import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
}

interface PricingData {
  originalPrice: number;
  discountPrice: number;
}

type OrderStatus =
  | 'DRAFT'
  | 'AWAITING_OFFER'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

interface RestoreFlowState {
  imageUri: string | null;
  orderId: string | null;
  customer: CustomerData | null;
  pricing: PricingData;
  status: OrderStatus;
  outputImageUrl: string | null;
}

interface RestoreFlowContextType {
  flow: RestoreFlowState;
  setImageUri: (uri: string) => void;
  setCustomer: (data: CustomerData) => void;
  setStatus: (status: OrderStatus) => void;
  setOutputImageUrl: (url: string) => void;
  resetFlow: () => void;
}

const defaultPricing: PricingData = {
  originalPrice: 29.90,
  discountPrice: 14.90,
};

const initialState: RestoreFlowState = {
  imageUri: null,
  orderId: null,
  customer: null,
  pricing: defaultPricing,
  status: 'DRAFT',
  outputImageUrl: null,
};

const RestoreFlowContext = createContext<RestoreFlowContextType | undefined>(undefined);

export const RestoreFlowProvider = ({ children }: { children: ReactNode }) => {
  const [flow, setFlow] = useState<RestoreFlowState>(initialState);

  const setImageUri = (uri: string) => {
    setFlow(prev => ({
      ...prev,
      imageUri: uri,
      orderId: `order_${Date.now()}`,
      status: 'DRAFT',
    }));
  };

  const setCustomer = (data: CustomerData) => {
    setFlow(prev => ({ ...prev, customer: data, status: 'AWAITING_OFFER' }));
  };

  const setStatus = (status: OrderStatus) => {
    setFlow(prev => ({ ...prev, status }));
  };

  const setOutputImageUrl = (url: string) => {
    setFlow(prev => ({ ...prev, outputImageUrl: url, status: 'COMPLETED' }));
  };

  const resetFlow = () => setFlow(initialState);

  return (
    <RestoreFlowContext.Provider value={{ flow, setImageUri, setCustomer, setStatus, setOutputImageUrl, resetFlow }}>
      {children}
    </RestoreFlowContext.Provider>
  );
};

export const useRestoreFlow = () => {
  const ctx = useContext(RestoreFlowContext);
  if (!ctx) throw new Error('useRestoreFlow must be used within RestoreFlowProvider');
  return ctx;
};
