import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
        productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subcategory));
    }

    setFilterProducts(productsCopy);
  };

//   useEffect(() => {
//     setFilterProducts(products);
//   }, [products]);

    const sortProduct = () => {
        let fpCopy = filterProducts.slice();
        switch(sortType){
            case 'low-high':
                setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
                break;

            case 'high-low':
                setFilterProducts(fpCopy.sort((a,b) => (b.price - a.price)));
                break;

            default:
                applyFilter();
                break;
        }
    };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  useEffect(()=>{
    sortProduct();
  }, [sortType]);

  return (
    <section className="collection-section">
      <div className="container">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10">
          {/* Filter Section */}
          <div className="min-w-60 sm:w-1/4">
            <h3 onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl font-semibold flex items-center cursor-pointer uppercase gap-4">
              Filter
              <img src={assets.dropDown} alt="" className={`h-3 sm:hidden ${showFilter ? 'rotate-180' : ''}`} />
            </h3>
            {/* category filter */}
            <div className={`border border-gray-300 pl-5 py-4 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
              <p className="mb-4 text-sm font-medium uppercase">Categories</p>
              <div className="flex flex-col gap-4 text-sm font-light text-gray-700">
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Clothing" onChange={toggleCategory} />
                  Clothing
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Footwear" onChange={toggleCategory} />
                  Footwear
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Accessories" onChange={toggleCategory} />
                  Accessories
                </label>
              </div>
            </div>

            {/* subcategory filter */}
            <div className={`border border-gray-300 pl-5 py-4 my-6 ${showFilter ? '' : 'hidden'} sm:block`}>
              <p className="mb-4 text-sm font-medium uppercase">Subcategories</p>
              <div className="flex flex-col gap-4 text-sm font-light text-gray-700">
                {/* Clothing Subcategories */}
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Jackets" onChange={toggleSubCategory} />
                  Jackets
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="T-Shirts" onChange={toggleSubCategory} />
                  T-Shirts
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Jeans" onChange={toggleSubCategory} />
                  Jeans
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Coats" onChange={toggleSubCategory} />
                  Coats
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Hoodies" onChange={toggleSubCategory} />
                  Hoodies
                </label>

                {/* Footwear Subcategories */}
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Sneakers" onChange={toggleSubCategory} />
                  Sneakers
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Formal" onChange={toggleSubCategory} />
                  Formal
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Boots" onChange={toggleSubCategory} />
                  Boots
                </label>

                {/* Accessories Subcategories */}
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Watches" onChange={toggleSubCategory} />
                  Watches
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Sunglasses" onChange={toggleSubCategory} />
                  Sunglasses
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Wallets" onChange={toggleSubCategory} />
                  Wallets
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Scarves" onChange={toggleSubCategory} />
                  Scarves
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" value="Bags" onChange={toggleSubCategory} />
                  Bags
                </label>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-1">
            <div className="flex justify-between items-center text-base sm:text-2xl mb-6">
              <Title text1={'All'} text2={'Collection'} />
              {/* product sort */}
              <select onChange={(e)=>setSortType(e.target.value)} className="border-2 outline-0 border-gray-300 text-sm px-4 py-2 rounded">
                <option value="relavent">Sort by: Relavent</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </div>

            {/* map product */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 gap-y-8">
              {filterProducts.length > 0 ? (
                filterProducts.map((item, index) => (
                  <ProductItem key={index} id={item.id} images={item.images} name={item.name} price={item.price} />
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collection;
