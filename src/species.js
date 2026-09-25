/** @typedef {Object} Species
 * @property {string} name
 * @property {string} description
 * @property {string} latinName
 * @property {string} url
 * @property {number} spriteIndex Column in sprites/species.png holding the feather colours
 * @property {string} highlightColor
 * @property {string[]} [tags]
 * @property {string} [rarity]
 * @property {string} [hint] Shown in the Field Guide while the species is still locked
 */

// Each species is drawn from its own sprite sheet at sprites/birds/<id>.png

/** @type {Record<string, Species>} */
const species = {
  "mariamulata": {
    "name": "Mariamulata",
    "description": "También llamada chanate o clarinero, es un ave paseriforme de la familia Icteridae propia de América. Es la más grande de los zanates: los machos miden hasta 43 cm; las hembras, hasta 33 cm.",
    "latinName": "Quiscalus mexicanus",
    "url": "https://es.wikipedia.org/wiki/Quiscalus_mexicanus",
    "spriteIndex": 0,
    "highlightColor": "#4b3c9c"
  },
  "golero": {
    "name": "Golero",
    "description": "Ave del orden Cathartiformes —aunque algunas clasificaciones lo sitúan en Ciconiiformes— y una de las especies más abundantes de la familia Cathartidae.",
    "latinName": "Coragyps atratus",
    "url": "https://es.wikipedia.org/wiki/Coragyps_atratus",
    "spriteIndex": 1,
    "highlightColor": "#85848a"
  },
  "guacamaya": {
    "name": "Guacamaya",
    "description": "Voz de origen taíno. En Colombia también se conoce como guacamaya bandera. Vive desde el sureste de México hasta el centro de Bolivia, en bosques húmedos tropicales cercanos a grandes ríos; en Colombia, en los valles bajos del Cauca y del Magdalena, la Orinoquía y la Amazonia. Es el ave nacional de Honduras.",
    "latinName": "Ara macao",
    "url": "https://es.wikipedia.org/wiki/Ara_macao",
    "spriteIndex": 2,
    "highlightColor": "#d62a1e",
    "rarity": "uncommon"
  },
  "lechuza": {
    "name": "Lechuza",
    "description": "También llamada lechuza de campanario o lechuza blanca, es un ave estrigiforme de la familia Tytonidae.",
    "latinName": "Tyto alba",
    "url": "https://es.wikipedia.org/wiki/Tyto_alba",
    "spriteIndex": 3,
    "highlightColor": "#d9a45a"
  },
  "cuervo": {
    "name": "Cuervo",
    "description": "Ave paseriforme de la familia Corvidae presente en casi todo el hemisferio norte. Edgar Allan Poe lo convirtió en el mensajero sobrenatural de «El cuervo», poema publicado en 1845 en el que el pájaro, posado sobre un busto de Palas Atenea, repite una y otra vez «Nunca más».",
    "latinName": "Corvus corax",
    "url": "https://es.wikipedia.org/wiki/Corvus_corax",
    "spriteIndex": 4,
    "highlightColor": "#3c3b5c",
    "rarity": "poe",
    "hint": "Pista: ¿qué repite el cuervo de Poe? Ponle ese nombre a tu pájaro."
  },
}

export default species;
