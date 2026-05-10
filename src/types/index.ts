export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  yearsExperience: number;
  salary: number;
  bonusPercent: number;
  hireDate: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  unit: string;
  stock: number;
  active: boolean;
}

export interface ProductsTableMeta {
  onEditProduct?: (product: Product) => void;
}

export interface TableMeta {
  editable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'select' | 'checkbox' | 'phone' | 'percentage';
  required?: boolean;
  userField?: keyof User;
  mutedLinkAccent?: boolean;
}
