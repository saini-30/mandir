export interface ImageType {
  id: number;
  url: string;
  category: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface DonationFormData {
  donorName: string;
  email: string;
  phone: string;
  amount: string;
  donationType: string;
  eventId: string;
  isAnonymous: boolean;
}

export interface Event {
  _id: string;
  title: string;
  targetAmount: number;
  raisedAmount: number;
}

export interface CheckboxEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    checked: boolean;
  };
}




