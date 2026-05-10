import initialUsers from '@/mock/data.json';
import initialProducts from '@/mock/products.json';
import type { Product, User } from '@/types';

let mockUsers: User[] = structuredClone(initialUsers as User[]);

let mockProducts: Product[] = structuredClone(initialProducts as Product[]);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchUsers = async (): Promise<User[]> => {
  await delay(500);
  return mockUsers.map((user) => ({ ...user }));
};

export const updateUser = async (user: User): Promise<User> => {
  await delay(500);
  const existingUser = mockUsers.find((u) => u.id === user.id);
  if (existingUser) {
    const nextUser = { ...user };
    mockUsers = mockUsers.map((currentUser) =>
      currentUser.id === user.id ? nextUser : currentUser,
    );
    return { ...nextUser };
  }
  throw new Error('User not found');
};

export const deleteUser = async (userId: number): Promise<void> => {
  await delay(500);
  mockUsers = mockUsers.filter((u) => u.id !== userId);
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  await delay(500);
  const newUser: User = {
    ...user,
    id: Math.max(...mockUsers.map((u) => u.id), 0) + 1,
  };
  mockUsers = [...mockUsers, newUser];
  return { ...newUser };
};

export const fetchProducts = async (): Promise<Product[]> => {
  await delay(500);
  return mockProducts.map((product) => ({ ...product }));
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  await delay(500);
  const next: Product = {
    ...product,
    id: Math.max(...mockProducts.map((p) => p.id), 0) + 1,
  };
  mockProducts = [...mockProducts, next];
  return { ...next };
};

export const updateProduct = async (product: Product): Promise<Product> => {
  await delay(500);
  const exists = mockProducts.some((p) => p.id === product.id);
  if (!exists) {
    throw new Error('Product not found');
  }
  mockProducts = mockProducts.map((p) => (p.id === product.id ? { ...product } : p));
  return { ...product };
};
