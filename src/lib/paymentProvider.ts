/* eslint-disable @typescript-eslint/naming-convention */
const QPAY_V2_URL = process.env.QPAY_V2_URL || '';
const QPAY_USERNAME = process.env.QPAY_USERNAME || '';
const QPAY_PASSWORD = process.env.QPAY_PASSWORD || '';
const QPAY_INVOICE_CODE = process.env.QPAY_INVOICE_CODE || '';
const BASE_URL = process.env.BASE_URL || '';
import axios from 'axios';
import { format, isAfter } from 'date-fns';

type AuthObjectType = {
  expires_in: Date;
  access_token: string;
};

type TransactionDataType = {
  amount: number | undefined;
  invoiceNo: string;
  expireAt: Date | undefined;
};

type PaymentCheckResponse = {
  count: number;
  paid_amount: number;
  rows: [
    {
      payment_id: string;
      payment_status: string;
      payment_date: string;
      payment_fee: string;
      payment_amount: string;
      payment_currency: string;
      payment_wallet: string;
      transaction_type: string;
    },
  ];
};
let authObj: AuthObjectType;

// GET AUTH TOKEN
async function auth() {
  const URL = `${QPAY_V2_URL}/auth/token`;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const auth = { username: QPAY_USERNAME, password: QPAY_PASSWORD };
  const response = await axios.post(URL, { withCredentials: true }, { auth });

  authObj = response.data;

  return authObj;
}

async function getToken() {
  if (authObj) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { expires_in, access_token } = authObj;
    // const isValid = moment(expires_in).isAfter(moment());
    const isValid = isAfter(expires_in, new Date());
    if (isValid) {
      return access_token;
    }
  }
  const resp = await auth();

  return resp.access_token;
}

async function getAuthHeader() {
  const token = await getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function generate(transactionData: TransactionDataType) {
  const { amount, invoiceNo, expireAt } = transactionData;
  console.log(transactionData);
  // const invoiceDueDate = expireAt
  //   ? moment(expireAt).zone('Asia/Ulaanbaatar').format('YYYY-MM-DD HH:mm:ss')
  //   : null;
  const invoiceDueDate = expireAt
    ? format(expireAt, 'yyyy-MM-dd HH:mm:ss')
    : null;

  const URL = `${QPAY_V2_URL}/invoice`;
  console.log(URL);
  const CALLBACK_URL = `${BASE_URL}/api/invoice/checkQpayV2/${invoiceNo}`;
  const body = {
    invoice_code: QPAY_INVOICE_CODE,
    sender_invoice_no: invoiceNo,
    invoice_receiver_code: 'terminal',
    invoice_description: `MONK token ${amount} төлбөр`,
    invoice_due_date: invoiceDueDate, // FIX ME its not working
    amount,
    callback_url: CALLBACK_URL,
  };

  const headers = await getAuthHeader();

  const response = await axios.post(URL, body, { headers });
  const invoiceData = response.data;
  console.log(invoiceData);
  return {
    providerInvoiceNo: invoiceData.invoice_id,
    ...invoiceData,
  };
}
export async function verify({ invoiceId }: { invoiceId: string }) {
  const URL = `${QPAY_V2_URL}/payment/check`;
  const body = {
    object_type: 'INVOICE',
    object_id: invoiceId,
    offset: {
      page_number: 1,
      page_limit: 100,
    },
  };
  const headers = await getAuthHeader();
  const response = await axios.post(URL, body, { headers });
  const paymentData = response.data as PaymentCheckResponse;
  console.log(paymentData);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { rows } = paymentData;
  const isPaid = rows[0]?.payment_status === 'PAID';
  const payment_status = isPaid ? 'PAID' : 'UNPAID';

  const msg = {
    code: 'error',
    desc: 'Unknown error',
    providerResponseCode: payment_status,
    providerResponseDesc: JSON.stringify(paymentData),
  };

  if (payment_status === 'PAID') {
    msg.code = 'success';
    msg.desc = '';
    return msg;
  }

  return msg;
}
