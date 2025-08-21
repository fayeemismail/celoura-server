



export interface Booking {
  _id?: string;

  guide: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };

  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };

  startDate: Date;
  endDate: Date;
  durationInDays: string;
  budget?: string;
  locations: string[];

  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  guideAccepted: boolean;
  rejected: boolean;
  rejectedReason: string;
  cancelledBy?: 'user' | 'guide';
  specialRequests?: string;

  paymentStatus?: "pending" | "paid" | "failed" | "cancelled";
  paymentDeadline?: Date; 

  createdAt?: Date;
  updatedAt?: Date;
}