import { products as userProducts } from '../modules/user/data/index';

export const products = userProducts;

export const getProductById = (id) => {
    return products.find((p) => String(p.id) === String(id));
};

export const getProductsByCategory = (category) => {
    return products.filter((p) => p.category === category);
};
