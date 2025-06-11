export interface Event {
  _id: string;
  title: string;
  targetAmount: number;
  raisedAmount: number;
}

export interface DonationProps {
  selectedEvent?: Event | null;
}

export interface FormData {
  donorName: string;
  email: string;
  phone: string;
  amount: string;
  donationType: string;
  eventId: string;
  isAnonymous: boolean;
}