import React, { useEffect, useState, useRef, useContext } from 'react';
import Isotope from 'isotope-layout';
import imagesLoaded from 'imagesloaded';
import axios from 'axios';
import { backendUrl } from '../App';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const IsotopeSection = () => {
    const { products } = useContext(ShopContext);
    const [categories, setCategories] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('*');
    const isotope = useRef(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/product/categories`);
            const data = Array.isArray(response.data) ? response.data : response.data.data || [];
            setCategories(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (product) => {
        if (!product.category) return 'uncategorized';
        if (typeof product.category === 'object' && product.category.name) {
            return product.category.name;
        }
        const foundCategory = categories.find(cat => cat._id === product.category);
        return foundCategory ? foundCategory.name : 'uncategorized';
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const grid = document.querySelector('.isotop-list');
        if (grid) {
            imagesLoaded(grid, () => {
                isotope.current = new Isotope(grid, {
                    itemSelector: '.isotope-item',
                    percentPosition: true,
                    masonry: {
                        columnWidth: '.isotope-item'
                    }
                });
            });
        }
    }, [products]);

    useEffect(() => {
        const filtered = activeFilter === '*'
            ? products
            : products.filter(product =>
                `cat-${getCategoryName(product).toLowerCase().replace(/\s+/g, '-')}` === activeFilter
            );
        setFilterProducts(filtered);

        if (isotope.current) {
            isotope.current.arrange({
                filter: activeFilter === '*' ? '*' : `.${activeFilter}`
            });
        }
    }, [activeFilter, products, categories]);

    const handleFilter = (filterValue) => {
        setActiveFilter(filterValue);
    };

    return (
        <section className="isotop-section section-gap wow animate__ animate__backInUp animated">
            <div className="container">
                <div className="isotope px-4 py-6">
                    {/* Filter Buttons */}
                    <div className="button-group filters-button-group flex flex-wrap gap-2 mb-6 justify-center">
                        <button
                            className={`px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-400 transition ${
                                activeFilter === '*' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
                            }`}
                            onClick={() => handleFilter('*')}
                        >
                            All
                        </button>

                        {categories.map((category) => {
                            const filterKey = `cat-${category.name.toLowerCase().replace(/\s+/g, '-')}`;
                            return (
                                <button
                                    key={category._id}
                                    className={`px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-400 transition ${
                                        activeFilter === filterKey ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
                                    }`}
                                    onClick={() => handleFilter(filterKey)}
                                >
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Products Grid */}
                    <div
                        id="isotope-container"
                        className="isotop-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    >
                        {products.map((item) => {
                            const filterClass = `cat-${getCategoryName(item).toLowerCase().replace(/\s+/g, '-')}`;
                            return (
                                <div
                                    key={item._id}
                                    className={`isotope-item ${filterClass} bg-white rounded-lg shadow-md p-4 transition-transform duration-300 ease-in-out hover:scale-105`}
                                >
                                    <ProductItem
                                        _id={item._id}
                                        image={item.image}
                                        name={item.name}
                                        price={item.price}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IsotopeSection;
