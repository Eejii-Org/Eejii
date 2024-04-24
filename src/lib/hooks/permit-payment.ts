import { useApiHandler } from '.';

export const createPermitInvoice = (permitId: string, userId: string) => {
  return fetch('/api/permit/create', {
    method: 'POST',
    body: JSON.stringify({ userId: userId, permitId: permitId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const verifyPermitInvoice = (paymentId: string) => {
  return fetch('/api/permit/verify', {
    method: 'POST',
    body: JSON.stringify({ paymentId: paymentId }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const useCreatePermitInvoice = () => useApiHandler(createPermitInvoice);
export const useVerifyPermitInvoice = () => useApiHandler(verifyPermitInvoice);
