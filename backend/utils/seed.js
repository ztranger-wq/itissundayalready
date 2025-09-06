const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: './backend/.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const products = [
  {
    name: 'Hang Tags',
    description: 'Custom hang tags that add a professional touch to your products.',
    images: [
      "https://placehold.co/600x400/262626/white?text=Hang+Tag+1",
      "https://placehold.co/600x400/262626/white?text=Hang+Tag+2",
      "https://placehold.co/600x400/262626/white?text=Hang+Tag+3"
    ],
    price: 25.00,
    category: 'tags',
    brand: 'Jaksh'
  },
  {
    name: 'Heat Transfers',
    description: 'Easy-to-apply heat transfers for a clean, tagless look.',
    images: [
      "https://placehold.co/600x400/e50000/white?text=Heat+Transfer+1",
      "https://placehold.co/600x400/e50000/white?text=Heat+Transfer+2",
      "https://placehold.co/600x400/e50000/white?text=Heat+Transfer+3"
    ],
    price: 29.50,
    category: 'tags',
    brand: 'Jaksh'
  },
  {
    name: 'Badges & Magnets',
    description: 'Custom badges and magnets for promotions, events, and branding.',
    images: [
      "https://placehold.co/600x400/e50000/white?text=Badge+1",
      "https://placehold.co/600x400/e50000/white?text=Magnet+1",
      "https://placehold.co/600x400/e50000/white?text=Badge+2"
    ],
    price: 12.50,
    category: 'school',
    brand: 'Jaksh'
  },
  // --- NEW JAKSH PRODUCTS ---
  // Badges & Recognition
  {
    name: 'Metal Badges',
    description: 'Premium, durable metal badges with custom engraving and finishes.',
    images: ["https://placehold.co/600x400/e50000/white?text=Metal+Badge"],
    price: 250.00,
    category: 'Badges & Recognition',
    brand: 'Jaksh'
  },
  {
    name: 'Plastic Badges',
    description: 'Lightweight and versatile plastic badges, fully customizable with your logo.',
    images: ["https://placehold.co/600x400/262626/white?text=Plastic+Badge"],
    price: 150.00,
    category: 'Badges & Recognition',
    brand: 'Jaksh'
  },
  {
    name: 'Magnetic Name Tags',
    description: 'Professional magnetic name tags that won\'t damage clothing.',
    images: ["https://placehold.co/600x400/e50000/white?text=Magnetic+Tag"],
    price: 180.00,
    category: 'Badges & Recognition',
    brand: 'Jaksh'
  },
  // Corporate & Promotional Merchandise
  {
    name: 'Customized Pens & Diaries',
    description: 'Elegant pens and diaries, perfect for corporate branding and gifts.',
    images: ["https://placehold.co/600x400/262626/white?text=Office+Essentials"],
    price: 499.00,
    category: 'Corporate & Promotional Merchandise',
    brand: 'Jaksh'
  },
  {
    name: 'Custom Drinkware',
    description: 'High-quality mugs, bottles, and tumblers with your brand logo.',
    images: ["https://placehold.co/600x400/e50000/white?text=Drinkware"],
    price: 350.00,
    category: 'Corporate & Promotional Merchandise',
    brand: 'Jaksh'
  },
  {
    name: 'Promotional T-shirts & Caps',
    description: 'Comfortable and stylish wearables for your team or event.',
    images: ["https://placehold.co/600x400/262626/white?text=Wearables"],
    price: 799.00,
    category: 'Corporate & Promotional Merchandise',
    brand: 'Jaksh'
  },
  {
    name: 'Employee Welcome Kits',
    description: 'Complete welcome kits including lanyards, ID cards, and diaries.',
    images: ["https://placehold.co/600x400/e50000/white?text=Welcome+Kit"],
    price: 1200.00,
    category: 'Corporate & Promotional Merchandise',
    brand: 'Jaksh'
  },
  // Event & Branding Solutions
  {
    name: 'Event Passes & Entry Cards',
    description: 'Secure and professional passes for your events and conferences.',
    images: ["https://placehold.co/600x400/262626/white?text=Event+Pass"],
    price: 80.00,
    category: 'Event & Branding Solutions',
    brand: 'Jaksh'
  },
  {
    name: 'Customized Wristbands',
    description: 'Durable and vibrant wristbands for event access and promotion.',
    images: ["https://placehold.co/600x400/e50000/white?text=Wristbands"],
    price: 50.00,
    category: 'Event & Branding Solutions',
    brand: 'Jaksh'
  },
  // School & Institutional Solutions
  {
    name: 'Student ID Cards',
    description: 'High-quality, durable ID cards for students and staff.',
    images: ["https://placehold.co/600x400/262626/white?text=Student+ID"],
    price: 120.00,
    category: 'School & Institutional Solutions',
    brand: 'Jaksh'
  },
  {
    name: 'Award Ribbons & Trophies',
    description: 'Customized awards to recognize achievement and excellence.',
    images: ["https://placehold.co/600x400/e50000/white?text=Trophies"],
    price: 950.00,
    category: 'School & Institutional Solutions',
    brand: 'Jaksh'
  },
  // Packaging & Gifting
  {
    name: 'Corporate Gift Sets',
    description: 'Curated gift sets for employees, clients, and partners.',
    images: ["https://placehold.co/600x400/262626/white?text=Gift+Sets"],
    price: 1500.00,
    category: 'Packaging & Gifting',
    brand: 'Jaksh'
  },

  // --- NEW MS PRODUCTS ---
  // Labels & Tags
  {
    name: 'Woven Labels (Brand, Size, Care, Logo)',
    description: 'High-definition woven labels for branding, sizing, and care instructions. Fully customizable.',
    images: ["https://placehold.co/600x400/e50000/white?text=Woven+Labels"],
    price: 300.00,
    category: 'Labels & Tags',
    brand: 'MS'
  },
  {
    name: 'Printed Labels (Satin, Cotton, Taffeta)',
    description: 'Vibrant, full-color printed labels on a variety of materials for any application.',
    images: ["https://placehold.co/600x400/262626/white?text=Printed+Labels"],
    price: 250.00,
    category: 'Labels & Tags',
    brand: 'MS'
  },
  {
    name: 'Heat Transfer / Sublimation Labels',
    description: 'Tagless and comfortable heat transfer labels, perfect for apparel and performance wear.',
    images: ["https://placehold.co/600x400/e50000/white?text=Heat+Transfer"],
    price: 450.00,
    category: 'Labels & Tags',
    brand: 'MS'
  },
  {
    name: 'Hang Tags (Paper, Fabric, Eco-friendly)',
    description: 'Premium hang tags in various materials to elevate your product presentation.',
    images: ["https://placehold.co/600x400/262626/white?text=Hang+Tags"],
    price: 200.00,
    category: 'Labels & Tags',
    brand: 'MS'
  },
  {
    name: 'QR Code / Barcode Tags',
    description: 'Functional tags with QR codes or barcodes for inventory, marketing, and information.',
    images: ["https://placehold.co/600x400/e50000/white?text=QR+Code+Tags"],
    price: 350.00,
    category: 'Labels & Tags',
    brand: 'MS'
  },
  // Lanyards & ID Solutions
  {
    name: 'Lanyards - Sublimation Printed',
    description: 'Full-color, edge-to-edge printed lanyards for vibrant and complex designs.',
    images: ["https://placehold.co/600x400/262626/white?text=Sublimation+Lanyard"],
    price: 150.00,
    category: 'Lanyards & ID Solutions',
    brand: 'MS'
  },
  {
    name: 'Lanyards - Woven / Jacquard',
    description: 'Durable and elegant woven lanyards with your logo stitched directly into the fabric.',
    images: ["https://placehold.co/600x400/e50000/white?text=Woven+Lanyard"],
    price: 180.00,
    category: 'Lanyards & ID Solutions',
    brand: 'MS'
  },
  {
    name: 'Lanyards - Plain / Single Color',
    description: 'Simple, high-quality lanyards available in a wide range of standard colors.',
    images: ["https://placehold.co/600x400/262626/white?text=Plain+Lanyard"],
    price: 80.00,
    category: 'Lanyards & ID Solutions',
    brand: 'MS'
  },
  {
    name: 'ID Cards - PVC',
    description: 'Standard, durable PVC plastic ID cards for employees, students, and members.',
    images: ["https://placehold.co/600x400/e50000/white?text=PVC+ID+Card"],
    price: 100.00,
    category: 'Lanyards & ID Solutions',
    brand: 'MS'
  },
  {
    name: 'ID Cards - Smart / RFID',
    description: 'Advanced ID cards with embedded RFID chips for access control and smart functionality.',
    images: ["https://placehold.co/600x400/262626/white?text=Smart+ID+Card"],
    price: 400.00,
    category: 'Lanyards & ID Solutions',
    brand: 'MS'
  },
  {
    name: 'Accessories - ID Holders & Yo-yo Reels',
    description: 'A variety of ID card holders, badge reels, and clips to complete your solution.',
    images: ["https://placehold.co/600x400/e50000/white?text=ID+Accessories"],
    price: 75.00,
    category: 'Lanyards & ID Solutions',
    brand: 'MS'
  },
  // Ribbons & Packaging
  {
    name: 'Printed Ribbons (Sublimation, Foil, Satin)',
    description: 'Custom printed ribbons for branding, events, and premium packaging.',
    images: ["https://placehold.co/600x400/262626/white?text=Printed+Ribbon"],
    price: 500.00,
    category: 'Ribbons & Packaging',
    brand: 'MS'
  },
  {
    name: 'Event & Gift Wrapping Ribbons',
    description: 'High-quality ribbons for ceremonies, gift wrapping, and special occasions.',
    images: ["https://placehold.co/600x400/e50000/white?text=Gift+Ribbon"],
    price: 450.00,
    category: 'Ribbons & Packaging',
    brand: 'MS'
  },
];

const importData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
