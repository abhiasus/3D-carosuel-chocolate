// w = width in 3D units, ratio = image width / height
// BASE_URL makes images work on GitHub Pages (/3D-carosuel-chocolate/)
const base = import.meta.env.BASE_URL;

export const products = [
  {
    id: 1, brand: 'Nestlé KitKat', name: 'Classic', price: '₹20',
    desc: 'Light, crispy wafer fingers wrapped in smooth milk chocolate. The original way to take a break.',
    chips: ['Crispy wafer', '89 kcal / bar'],
    img: `${base}choco/kitkat-classic.png`, ratio: 1.8568, w: 6.6, tilt: -0.1, accent: '#e53228',
  },
  {
    id: 2, brand: 'Nestlé KitKat', name: '70% Dark', price: '₹99',
    desc: 'Crisp wafer covered in rich 70% cocoa dark chocolate for a deeper, bolder snap.',
    chips: ['70% cocoa', 'Fairtrade'],
    img: `${base}choco/kitkat-dark.png`, ratio: 1.3953, w: 6.0, tilt: 0.05, accent: '#d9a25f',
  },
  {
    id: 3, brand: 'Nestlé KitKat', name: 'Crispy & Creamy', price: '₹40',
    desc: 'Crunchy wafer in a creamy milk chocolate coating. Break a finger, share a moment.',
    chips: ['Coated wafer', '42 kcal / finger'],
    img: `${base}choco/kitkat-creamy.png`, ratio: 1.4975, w: 5.6, tilt: 0.06, accent: '#f08a3c',
  },
];