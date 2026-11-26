import type {
  EarningsBookingRow,
  NigerianBankOption,
  PayoutAccount,
  PayoutHistoryEntry,
} from "@/features/caregiver-dashboard/types/earnings";

export const EARNINGS_COMMISSION_RATE = 0.1;

/** Demo OTP that successfully verifies a payout account. */
export const PAYOUT_OTP_CORRECT = "482001";
export const PAYOUT_OTP_MAX_ATTEMPTS = 3;
export const PAYOUT_OTP_EXPIRY_SECONDS = 10 * 60;

export const nigerianBanks: NigerianBankOption[] = [
  {
    code: "044",
    name: "Access Bank",
    shortName: "Access",
  },
  {
    code: "011",
    name: "First Bank of Nigeria",
    shortName: "FirstBank",
  },
  {
    code: "058",
    name: "Guaranty Trust Bank (GTBank)",
    shortName: "GTBank",
  },
  {
    code: "090267",
    name: "Kuda Bank",
    shortName: "Kuda",
  },
  {
    code: "033",
    name: "United Bank for Africa (UBA)",
    shortName: "UBA",
  },
  {
    code: "057",
    name: "Zenith Bank",
    shortName: "Zenith",
  },
];

export const defaultPayoutBank =
  nigerianBanks.find((bank) => bank.code === "058") ?? nigerianBanks[0];

export const verifiedIdAccountName = "EMEKA C. OKONKWO";
export const maskedCaregiverPhone = "+234 803 *** 0142";

export const defaultPayoutAccount: PayoutAccount = {
  bankCode: "058",
  bankName: "Guaranty Trust Bank (GTBank)",
  bankShortName: "GTBank",
  accountNumber: "0123454821",
  accountName: verifiedIdAccountName,
  last4: "4821",
  verified: true,
};

export const earningsSummarySeed = {
  totalEarned: 1_240_600,
  onHold: 166_500,
  available: 75_600,
};

export const earningsBookingRowsSeed: EarningsBookingRow[] = [
  {
    id: "cv-2041",
    dateLabel: "13 Oct",
    careseekerName: "Grace Bills",
    reference: "#CV-2041",
    arrangement: "Live-in",
    bookingPrice: 185_000,
    commission: 18_500,
    youGet: 166_500,
    status: "held",
  },
  {
    id: "cv-1877",
    dateLabel: "29 Sep",
    careseekerName: "Kemi Ojo",
    reference: "#CV-1877",
    arrangement: "Live-in",
    bookingPrice: 84_000,
    commission: 8_400,
    youGet: 75_600,
    status: "available",
  },
  {
    id: "cv-1830",
    dateLabel: "18 Sep",
    careseekerName: "Tunde Bakare",
    reference: "#CV-1830",
    arrangement: "Overnight",
    bookingPrice: 80_000,
    commission: 8_000,
    youGet: 72_000,
    status: "paid_out",
  },
  {
    id: "cv-1802",
    dateLabel: "8 Sep",
    careseekerName: "Chidi Okafor",
    reference: "#CV-1802",
    arrangement: "Full day",
    bookingPrice: 140_000,
    commission: 14_000,
    youGet: 126_000,
    status: "paid_out",
  },
  {
    id: "cv-1745",
    dateLabel: "30 Aug",
    careseekerName: "Ada Coker",
    reference: "#CV-1745",
    arrangement: "Transport",
    bookingPrice: 16_000,
    commission: 1_600,
    youGet: 14_400,
    status: "paid_out",
  },
];

export const payoutHistorySeed: PayoutHistoryEntry[] = [
  {
    id: "po-1",
    amount: 72_000,
    bankShortName: "GTBank",
    last4: "4821",
    status: "paid",
    dateLabel: "18 Oct",
  },
  {
    id: "po-2",
    amount: 126_000,
    bankShortName: "GTBank",
    last4: "4821",
    status: "paid",
    dateLabel: "12 Sep",
  },
  {
    id: "po-3",
    amount: 14_400,
    bankShortName: "GTBank",
    last4: "4821",
    status: "paid",
    dateLabel: "3 Sep",
  },
];

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

export function maskAccountNumber(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4) || "----";
  return `•••• ${last4}`;
}

export function resolveAccountName(accountNumber: string): string | null {
  const digits = accountNumber.replace(/\D/g, "");
  // Demo resolve: 10-digit numbers ending in 4821 match verified ID.
  if (digits.length === 10 && digits.endsWith("4821")) {
    return verifiedIdAccountName;
  }
  if (digits.length === 10) {
    return "ADEOLA M. BANKS";
  }
  return null;
}
