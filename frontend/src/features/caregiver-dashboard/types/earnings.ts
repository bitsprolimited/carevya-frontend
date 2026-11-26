export type EarningsPeriod =
  | "this_week"
  | "this_month"
  | "last_3_months"
  | "this_year"
  | "all_time";

export type EarningsBookingStatus = "held" | "available" | "paid_out";

export type EarningsBookingRow = {
  id: string;
  dateLabel: string;
  careseekerName: string;
  reference: string;
  arrangement: string;
  bookingPrice: number;
  commission: number;
  youGet: number;
  status: EarningsBookingStatus;
};

export type PayoutAccount = {
  bankCode: string;
  bankName: string;
  bankShortName: string;
  accountNumber: string;
  accountName: string;
  last4: string;
  verified: boolean;
};

export type PayoutHistoryEntry = {
  id: string;
  amount: number;
  bankShortName: string;
  last4: string;
  status: "paid" | "processing";
  dateLabel: string;
};

export type NigerianBankOption = {
  code: string;
  name: string;
  shortName: string;
};
