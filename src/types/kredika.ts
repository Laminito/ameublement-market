export type CreditStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
export type InstallmentStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface CreditReservationRequest {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  amount: number;
  duration: 1 | 2 | 3 | 4 | 5 | 6;
  orderNumber: string;
}

export interface CreditReservation {
  id: string;
  reservationNumber: string;
  customerId: string;
  amount: number;
  duration: number;
  monthlyInstallment: number;
  totalWithInterest: number;
  interestRate: number;
  status: CreditStatus;
  createdAt: Date;
}

export interface Installment {
  id: string;
  reservationId: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  status: InstallmentStatus;
  paidAt?: Date;
}

export interface PaymentInstruction {
  id: string;
  method: 'ORANGE_MONEY' | 'WAVE' | 'FREE_MONEY' | 'BANK_TRANSFER' | 'CARD';
  accountNumber: string;
  accountName: string;
  reference: string;
  amount: number;
}

export interface CreditApplication {
  orderId: string;
  customerId: string;
  amount: number;
  duration: 3 | 6 | 9 | 12 | 18 | 24;
  monthlyInstallment: number;
  totalWithInterest: number;
  interestRate: number;
  reservationId?: string;
  status: CreditStatus;
  installments: Installment[];
  paymentInstructions?: PaymentInstruction[];
}
