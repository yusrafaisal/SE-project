export interface CartItem {
  menu_item_id: number
  name: string
  price: number
  quantity: number
  image_url?: string | null
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('saveur_cart') || '[]')
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem('saveur_cart', JSON.stringify(cart))
}
