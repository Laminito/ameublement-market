import { INTEREST_RATES } from '@/constants/config';

export const calculateCreditDetails = (
  amount: number,
  duration: 1 | 2 | 3 | 4 | 5 | 6
) => {
  const interestRate = INTEREST_RATES[duration] || 0.15;
  const totalWithInterest = amount * (1 + interestRate);
  const monthlyInstallment = totalWithInterest / duration;
  
  return {
    amount,
    duration,
    interestRate,
    totalWithInterest,
    monthlyInstallment,
    totalInterest: totalWithInterest - amount,
  };
};

export const getInterestRate = (duration: number): number => {
  return INTEREST_RATES[duration] || 0.15;
};
