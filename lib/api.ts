const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  is_available: boolean
  image_url: string | null
}

export interface MenuItemCreate {
  name: string
  description: string
  price: number
  category: string
  is_available: boolean
  image_url: string | null
}

export const api = {
  async getMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${API_BASE}/menu`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch menu')
    return res.json()
  },

  async addItem(item: MenuItemCreate): Promise<{ id: number }> {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) throw new Error('Failed to add item')
    return res.json()
  },

  async updateItem(id: number, item: Partial<MenuItemCreate>): Promise<void> {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) throw new Error('Failed to update item')
  },

  async deleteItem(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete item')
  },
}
