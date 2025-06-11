declare module "*.jsx"

interface ImageType {
  id: number;
  url: string;
  category: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export { ImageType, FormState };
