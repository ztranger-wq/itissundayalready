import { useState } from 'react';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';

const msCategories = [
  'All',
  'Labels & Tags',
  'Lanyards & ID Solutions',
  'Ribbons & Packaging'
];

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>
        Our Products
      </h1>
      <ProductFilters
        categories={msCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ProductList 
        brand="MS" 
        category={activeCategory === 'All' ? '' : activeCategory} 
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default ProductsPage;