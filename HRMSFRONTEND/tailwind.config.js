/** @type {import('tailwindcss').Config} */
import plugin from 'tailwind-scrollbar';

export default 
{
  content: 
  [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: 
  {
    extend: 
    {
      fontFamily: 
      {
        lato: ['Lato', 'sans-serif'],
      roboto: ['Roboto', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
      chonburi: ['Chonburi', 'cursive'],
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, #2D54EE 0%, #88FFE9 100%)',
      },
    }
  },
  plugins: [plugin],
}