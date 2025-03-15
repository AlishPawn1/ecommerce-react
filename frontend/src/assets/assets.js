import logo from './logo.png';
import dashboardIcon from './dashboard.svg';
import accountIcon from './account.svg';
import addressIcon from './address.svg';
import downloadIcon from './download.svg';
import locationIcon from './location.svg';
import logoutIcon from './log-out.svg';
import searchIcon from './search-md.svg';
import shopIcon from './shop.svg';
import shoppingCartIcon from './shopping-cart-01.svg';
import userIcon from './user-01.svg';
import viewIcon from './View.svg';
import hamburgerIcon from './hamburger.svg';
import closeIcon from './cross.svg';
import bannerImage from './banner-img.jpg';
import returnImage from './7-days.png'
import supportImage from './customer-support.png'
import ExchangeImage from './Exchange-image.png'
import dropDown from './dropDown.svg'
import removeIcon from './remove.svg'
import esewa from './esewa.png'
import esewaLogo from './esewaLogo.png'
import khalti from './khalti.png'
import khaltiLogo from './khaltiLogo.png'
import stripeLogo from './stripeLogo.svg'


import productImage1 from './product-image-1.jpg';
import productImage2 from './product-image-2.jpg';
import productImage3 from './product-image-3.jpg';
import productImage4 from './product-image-4.jpg';
import productImage5 from './product-image-5.jpg';
import productImage6 from './product-image-6.jpg';
import productImage7 from './product-image-7.jpg';
import productImage8 from './product-image-8.jpg';
import productImage9 from './product-image-9.jpg';
import productImage10 from './product-image-10.png';
import productImage11 from './product-image-11.jpg';
import productImage12 from './product-image-12.jpg';
import productImage13 from './product-image-13.jpg';
import productImage14 from './product-image-14.jpg';
import productImage15 from './product-image-15.jpg';

export const assets = {
  logo,
  dashboardIcon,
  accountIcon,
  addressIcon,
  downloadIcon,
  locationIcon,
  logoutIcon,
  searchIcon,
  shopIcon,
  shoppingCartIcon,
  userIcon,
  viewIcon,
  hamburgerIcon,
  closeIcon,
  bannerImage,
  supportImage,
  returnImage,
  ExchangeImage,
  dropDown,
  removeIcon,
  esewa,
  esewaLogo,
  khalti,
  khaltiLogo,
  stripeLogo,
};

export const products = [
  {
    _id: 1,
    name: 'Classic Leather Jacket',
    description: 'A timeless black leather jacket for any occasion.',
    price: 120,
    image: [productImage1, productImage2, productImage3],
    category: 'Clothing',
    subcategory: 'Jackets',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-15',
    bestseller: true,
    stock: 50,
  },
  {
    _id: 2,
    name: 'Running Sneakers',
    description: 'Comfortable and stylish sneakers for daily wear and sports.',
    price: 90,
    image: [productImage4, productImage5, productImage6],
    category: 'Footwear',
    subcategory: 'Sneakers',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-10',
    bestseller: false,
    stock: 35,
  },
  {
    _id: 3,
    name: 'Elegant Wrist Watch',
    description: 'A sleek wristwatch with a stainless steel strap.',
    price: 250,
    image: [productImage7, productImage8, productImage9],
    category: 'Accessories',
    subcategory: 'Watches',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-01-30',
    bestseller: true,
    stock: 72,
  },
  {
    _id: 4,
    name: 'Casual T-Shirt',
    description: 'Soft cotton t-shirt available in multiple colors.',
    price: 25,
    image: [productImage10, productImage11],
    category: 'Clothing',
    subcategory: 'T-Shirts',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    date: '2025-02-05',
    bestseller: false,
    stock: 120,
  },
  {
    _id: 5,
    name: 'Denim Jeans',
    description: 'High-quality denim jeans with a slim fit.',
    price: 60,
    image: [productImage12, productImage13, productImage14],
    category: 'Clothing',
    subcategory: 'Jeans',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-01-25',
    bestseller: true,
    stock: 80,
  },
  {
    _id: 6,
    name: 'Formal Shoes',
    description: 'Elegant formal shoes suitable for office and special occasions.',
    price: 110,
    image: [productImage15, productImage1, productImage2],
    category: 'Footwear',
    subcategory: 'Formal',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-01',
    bestseller: false,
    stock: 25,
  },
  {
    _id: 7,
    name: 'Winter Coat',
    description: 'A warm, insulated coat for the colder months.',
    price: 150,
    image: [productImage1, productImage2, productImage3],
    category: 'Clothing',
    subcategory: 'Coats',
    size: ['M', 'L', 'XL'],
    date: '2025-02-12',
    bestseller: false,
    stock: 45,
  },
  {
    _id: 8,
    name: 'Sports Watch',
    description: 'A durable sports watch with multiple functions.',
    price: 200,
    image: [productImage7, productImage8, productImage9],
    category: 'Accessories',
    subcategory: 'Watches',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-03',
    bestseller: true,
    stock: 65,
  },
  {
    _id: 9,
    name: 'Stylish Sunglasses',
    description: 'Sunglasses with UV protection and a sleek design.',
    price: 50,
    image: [productImage4, productImage5, productImage6],
    category: 'Accessories',
    subcategory: 'Sunglasses',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-08',
    bestseller: false,
    stock: 90,
  },
  {
    _id: 10,
    name: 'Leather Wallet',
    description: 'A compact leather wallet with multiple card slots.',
    price: 35,
    image: [productImage10, productImage11],
    category: 'Accessories',
    subcategory: 'Wallets',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-01-20',
    bestseller: true,
    stock: 110,
  },
  {
    _id: 11,
    name: 'Knitted Scarf',
    description: 'A soft knitted scarf to keep you warm during winter.',
    price: 20,
    image: [productImage12, productImage13, productImage14],
    category: 'Accessories',
    subcategory: 'Scarves',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-02',
    bestseller: false,
    stock: 40,
  },
  {
    _id: 12,
    name: 'Tote Bag',
    description: 'A spacious and stylish tote bag for everyday use.',
    price: 45,
    image: [productImage15, productImage1, productImage2],
    category: 'Accessories',
    subcategory: 'Bags',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-06',
    bestseller: false,
    stock: 60,
  },
  {
    _id: 13,
    name: 'Puffer Jacket',
    description: 'A lightweight yet warm puffer jacket for chilly weather.',
    price: 100,
    image: [productImage1, productImage2, productImage3],
    category: 'Clothing',
    subcategory: 'Jackets',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-07',
    bestseller: true,
    stock: 75,
  },
  {
    _id: 14,
    name: 'Rain Boots',
    description: 'Waterproof boots for rainy days.',
    price: 80,
    image: [productImage4, productImage5, productImage6],
    category: 'Footwear',
    subcategory: 'Boots',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-01-28',
    bestseller: false,
    stock: 55,
  },
  {
    _id: 15,
    name: 'Comfortable Hoodie',
    description: 'A cozy hoodie perfect for casual wear.',
    price: 55,
    image: [productImage10, productImage11],
    category: 'Clothing',
    subcategory: 'Hoodies',
    size: ['S', 'M', 'L', 'XL'],
    date: '2025-02-13',
    bestseller: false,
    stock: 85,
  },
];
