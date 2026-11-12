/* So Valencia product data. To sell for real, paste each product's Stripe Payment Link into paymentLink. */
window.SV = {
 "colors": {
  "blanc": {
   "label": "Blanc",
   "hex": "#FFFFFF",
   "ink": "#1C3D8F"
  },
  "sorra": {
   "label": "Sorra",
   "hex": "#F4ECDC",
   "ink": "#1C3D8F"
  },
  "blau": {
   "label": "Blau",
   "hex": "#1C3D8F",
   "ink": "#FBF8F2"
  },
  "nit": {
   "label": "Nit",
   "hex": "#0F1B33",
   "ink": "#FBF8F2"
  }
 },
 "products": [
  {
   "id": "i-love-horchata",
   "name": "I love horchata",
   "kind": "tee",
   "colors": [
    "blanc",
    "sorra",
    "blau"
   ],
   "line1": "I love",
   "line2": "horchata",
   "desc": "For anyone who has had an ice-cold horchata in Alboraya and has thought about it ever since.",
   "story": [
    "Wait, what is horchata?",
    "A cold, sweet drink made from tigernuts (chufa) grown in the fields around Alboraya. Not the rice one."
   ],
   "paymentLink": ""
  },
  {
   "id": "sun-sand-agua",
   "name": "Sun, sand & Agua de Valencia",
   "kind": "tee",
   "colors": [
    "sorra",
    "blanc",
    "blau"
   ],
   "line1": "Sun, sand &",
   "line2": "Agua de Valencia",
   "desc": "For long beach days that end with a jug of Agua de Valencia somewhere in El Carmen.",
   "story": [
    "Wait, what is Agua de Valencia?",
    "The city's famous cocktail: fresh orange juice and cava with a splash of vodka and gin. Shared by the jug, never by the glass."
   ],
   "paymentLink": ""
  },
  {
   "id": "born-to-siesta",
   "name": "Born to siesta & fiesta",
   "kind": "tee",
   "colors": [
    "blau",
    "blanc",
    "sorra"
   ],
   "line1": "Born to",
   "line2": "siesta & fiesta",
   "desc": "Two priorities, in that order. Made for long lunches and even longer nights.",
   "story": null,
   "paymentLink": ""
  },
  {
   "id": "calories-hoodie",
   "name": "Calories don't count",
   "kind": "hoodie",
   "colors": [
    "nit",
    "blau"
   ],
   "line1": "Calories don't count",
   "line2": "in Valencia",
   "desc": "For the evenings when the sea breeze kicks in and the second dessert arrives anyway.",
   "story": null,
   "paymentLink": ""
  }
 ],
 "price": "[€ price]",
 "paths": {
  "tee": "M98 14 L58 26 L8 66 L36 116 L72 98 L72 306 Q72 312 78 312 L222 312 Q228 312 228 306 L228 98 L264 116 L292 66 L242 26 L202 14 C194 34 174 46 150 46 C126 46 106 34 98 14 Z",
  "teeCollar": "M98 14 C106 34 126 46 150 46 C174 46 194 34 202 14",
  "hoodie": "M104 40 C106 6 194 6 196 40 L246 58 C262 64 270 74 274 90 L294 236 L292 300 Q291 306 285 306 L262 306 Q256 306 256 300 L246 140 L244 312 Q244 318 238 318 L62 318 Q56 318 56 312 L54 140 L44 300 Q44 306 38 306 L15 306 Q9 306 8 300 L6 236 L26 90 C30 74 38 64 54 58 Z"
 }
};
