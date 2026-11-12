/**
 * The whole catalog lives here — edit names, houses, categories and notes
 * in this one file and every section updates.
 * category: 'nicho' | 'diseniador' | 'arabes'
 */
export type Category = 'nicho' | 'diseniador' | 'arabes'

export const CATEGORY_LABEL: Record<Category, string> = {
  nicho: 'Nicho',
  diseniador: 'Diseñador',
  arabes: 'Árabes',
}

export interface Product {
  name: string
  house: string
  category: Category
  note: string
  image: string
  /** show in the big pinned sequence */
  featured?: boolean
}

export const PRODUCTS: Product[] = [
  {
    name: 'Layton',
    house: 'Parfums de Marly',
    category: 'nicho',
    note: 'Manzana, lavanda y vainilla. El nicho más pedido.',
    image: './images/products/layton.png',
    featured: true,
  },
  {
    name: 'Baccarat Rouge 540',
    house: 'Maison Francis Kurkdjian',
    category: 'nicho',
    note: 'Azafrán, jazmín y ámbar. Inconfundible.',
    image: './images/products/br540.png',
    featured: true,
  },
  {
    name: 'Hacivat',
    house: 'Nishane',
    category: 'nicho',
    note: 'Piña, bergamota y cedro. Elegancia turca.',
    image: './images/products/hacivat.png',
  },
  {
    name: 'Torino 21',
    house: 'Xerjoff',
    category: 'nicho',
    note: 'Menta, limón y romero. La frescura de Turín.',
    image: './images/nicho.jpg',
  },
  {
    name: 'Eros',
    house: 'Versace',
    category: 'diseniador',
    note: 'Menta, manzana verde y cedro. Un clásico que nunca falla.',
    image: './images/products/eros.png',
    featured: true,
  },
  {
    name: 'Invictus Victory',
    house: 'Rabanne',
    category: 'diseniador',
    note: 'Vainilla, haba tonka y lavanda. Pura victoria.',
    image: './images/diseniador.jpg',
  },
  {
    name: 'Khamrah Qahwa',
    house: 'Lattafa',
    category: 'arabes',
    note: 'Café, canela y praliné. Más de 12 horas en la piel.',
    image: './images/products/khamrah.png',
    featured: true,
  },
  {
    name: 'Club de Nuit Intense',
    house: 'Armaf',
    category: 'arabes',
    note: 'Limón, abedul y almizcle. La leyenda.',
    image: './images/products/cdnim.png',
  },
  {
    name: 'Oud for Glory',
    house: 'Lattafa',
    category: 'arabes',
    note: 'Azafrán, oud y pachulí. Presencia total.',
    image: './images/products/oudglory.png',
    featured: true,
  },
]
