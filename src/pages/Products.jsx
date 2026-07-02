import { useState } from 'react'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']
const SORT_OPTIONS = ['Name (A-Z)', 'Name (Z-A)', 'Price (Low)', 'Price (High)', 'Stock (Low)']

const initialProducts = [
  { id: 1, name: 'Laptop Pro 15', category: 'Electronics', price: 1299.99, stock: 42, rating: 4.5, sku: 'EL-001' },
  { id: 2, name: 'Wireless Headphones', category: 'Electronics', price: 199.99, stock: 120, rating: 4.2, sku: 'EL-002' },
  { id: 3, name: 'Running Shoes X', category: 'Sports', price: 89.99, stock: 8, rating: 4.7, sku: 'SP-001' },
  { id: 4, name: 'Python Cookbook', category: 'Books', price: 39.99, stock: 55, rating: 4.8, sku: 'BK-001' },
  { id: 5, name: 'Smart Watch Ultra', category: 'Electronics', price: 349.99, stock: 30, rating: 4.4, sku: 'EL-003' },
  { id: 6, name: 'Yoga Mat Premium', category: 'Sports', price: 49.99, stock: 3, rating: 4.6, sku: 'SP-002' },
  { id: 7, name: 'Garden Tool Set', category: 'Home & Garden', price: 79.99, stock: 22, rating: 4.1, sku: 'HG-001' },
  { id: 8, name: 'Slim Fit Jacket', category: 'Clothing', price: 129.99, stock: 0, rating: 3.9, sku: 'CL-001' },
]

const emptyForm = { name: '', category: 'Electronics', price: '', stock: '', sku: '' }

export default function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Name (A-Z)')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [toastMsg, setToastMsg] = useState('')

  function applySort(list) {
    const sorted = [...list]
    switch (sortBy) {
      case 'Name (A-Z)': return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'Name (Z-A)': return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case 'Price (Low)': return sorted.sort((a, b) => a.price - b.price)
      case 'Price (High)': return sorted.sort((a, b) => b.price - a.price)
      case 'Stock (Low)': return sorted.sort((a, b) => a.stock - b.stock)
      default: return sorted
    }
  }

  const filtered = applySort(
    products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter
      return matchSearch && matchCat
    })
  )

  function addToCart(product) {
    setCart(c => {
      const existing = c.find(i => i.id === product.id)
      if (existing) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...c, { ...product, qty: 1 }]
    })
    flash(`"${product.name}" added to cart.`)
  }

  function openAddModal() {
    setEditingProduct(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEditModal(p) {
    setEditingProduct(p)
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, sku: p.sku })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingProduct(null)
    setForm(emptyForm)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10), rating: 0 }
    if (editingProduct) {
      setProducts(ps => ps.map(p => p.id === editingProduct.id ? { ...p, ...data } : p))
      flash('Product updated.')
    } else {
      setProducts(ps => [...ps, { ...data, id: Date.now() }])
      flash('Product added.')
    }
    closeModal()
  }

  function handleDelete(id) {
    setProducts(ps => ps.filter(p => p.id !== id))
    flash('Product deleted.')
  }

  function removeFromCart(id) {
    setCart(c => c.filter(i => i.id !== id))
  }

  function updateQty(id, delta) {
    setCart(c =>
      c.flatMap(i => {
        if (i.id !== id) return [i]
        const next = i.qty + delta
        return next <= 0 ? [] : [{ ...i, qty: next }]
      })
    )
  }

  function flash(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div data-testid="products-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6" data-testid="products-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="products-title">Product Catalog</h1>
          <p className="text-slate-500 text-sm" data-testid="products-subtitle">Browse and manage your product inventory</p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            data-testid="products-cart-btn"
            onClick={() => setCartOpen(true)}
            className="relative border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            🛒 Cart
            {cartCount > 0 && (
              <span data-testid="products-cart-count" className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            data-testid="products-add-btn"
            onClick={openAddModal}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div data-testid="products-toast" className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
          {toastMsg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center" data-testid="products-filters">
        <input
          type="text"
          data-testid="products-search-input"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          data-testid="products-category-filter"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          data-testid="products-sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="products-grid">
        {filtered.length === 0 ? (
          <div data-testid="products-empty-msg" className="col-span-full text-center py-12 text-slate-400">
            No products found.
          </div>
        ) : filtered.map(product => (
          <div key={product.id} data-testid={`product-card-${product.id}`} className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
            <div className="bg-slate-100 rounded-lg h-32 flex items-center justify-center text-4xl mb-3" data-testid={`product-image-${product.id}`}>
              {product.category === 'Electronics' ? '💻' :
               product.category === 'Sports' ? '🏃' :
               product.category === 'Books' ? '📚' :
               product.category === 'Clothing' ? '👕' : '🌿'}
            </div>
            <span className="text-xs text-indigo-600 font-medium mb-1" data-testid={`product-category-${product.id}`}>{product.category}</span>
            <h3 className="text-sm font-semibold text-slate-800 mb-1" data-testid={`product-name-${product.id}`}>{product.name}</h3>
            <p className="text-xs text-slate-400 mb-2" data-testid={`product-sku-${product.id}`}>SKU: {product.sku}</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-slate-800" data-testid={`product-price-${product.id}`}>${product.price.toFixed(2)}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-600' : product.stock < 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`} data-testid={`product-stock-${product.id}`}>
                {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
              </span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                data-testid={`product-add-to-cart-btn-${product.id}`}
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
                className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Add to Cart
              </button>
              <button
                data-testid={`product-edit-btn-${product.id}`}
                onClick={() => openEditModal(product)}
                className="text-xs border border-slate-300 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                data-testid={`product-delete-btn-${product.id}`}
                onClick={() => handleDelete(product.id)}
                className="text-xs border border-red-200 px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50"
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50" data-testid="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="bg-white h-full w-full max-w-sm shadow-2xl flex flex-col" data-testid="cart-drawer" onClick={e => e.stopPropagation()}>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100" data-testid="cart-header">
              <h2 className="text-lg font-bold text-slate-800" data-testid="cart-title">
                Shopping Cart
                {cartCount > 0 && <span className="ml-2 text-sm font-normal text-slate-400" data-testid="cart-item-count">({cartCount} item{cartCount !== 1 ? 's' : ''})</span>}
              </h2>
              <button data-testid="cart-close-btn" onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-slate-700 text-xl leading-none">✕</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4" data-testid="cart-items-list">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3" data-testid="cart-empty">
                  <span className="text-5xl">🛒</span>
                  <p className="text-sm" data-testid="cart-empty-msg">Your cart is empty.</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} data-testid={`cart-item-${item.id}`} className="flex items-center gap-3 py-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl flex-shrink-0" data-testid={`cart-item-icon-${item.id}`}>
                    {item.category === 'Electronics' ? '💻' : item.category === 'Sports' ? '🏃' : item.category === 'Books' ? '📚' : item.category === 'Clothing' ? '👕' : '🌿'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate" data-testid={`cart-item-name-${item.id}`}>{item.name}</p>
                    <p className="text-xs text-slate-400" data-testid={`cart-item-price-${item.id}`}>${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0" data-testid={`cart-item-qty-controls-${item.id}`}>
                    <button data-testid={`cart-item-decrease-${item.id}`} onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm leading-none flex items-center justify-center">−</button>
                    <span className="w-6 text-center text-sm font-semibold text-slate-800" data-testid={`cart-item-qty-${item.id}`}>{item.qty}</span>
                    <button data-testid={`cart-item-increase-${item.id}`} onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm leading-none flex items-center justify-center">+</button>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 w-16 text-right flex-shrink-0" data-testid={`cart-item-subtotal-${item.id}`}>${(item.price * item.qty).toFixed(2)}</p>
                  <button data-testid={`cart-item-remove-${item.id}`} onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 ml-1 flex-shrink-0">✕</button>
                </div>
              ))}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-3" data-testid="cart-footer">
                <div className="flex justify-between text-sm" data-testid="cart-total-row">
                  <span className="text-slate-500">Total</span>
                  <span className="font-bold text-lg text-slate-800" data-testid="cart-total-value">${cartTotal.toFixed(2)}</span>
                </div>
                <button data-testid="cart-checkout-btn" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors" onClick={() => { alert('Checkout not available in demo.') }}>
                  Proceed to Checkout
                </button>
                <button data-testid="cart-clear-btn" onClick={() => setCart([])} className="w-full border border-slate-300 text-slate-600 hover:bg-slate-50 py-2 rounded-lg text-sm">
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" data-testid="products-modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" data-testid="products-modal">
            <h2 className="text-lg font-bold text-slate-800 mb-5" data-testid="products-modal-title">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSave} data-testid="products-modal-form">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2" data-testid="products-form-name-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="products-form-name-label">Product Name</label>
                  <input type="text" name="name" data-testid="products-form-name-input" value={form.name} onChange={handleFormChange} required placeholder="Product name" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div data-testid="products-form-sku-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="products-form-sku-label">SKU</label>
                  <input type="text" name="sku" data-testid="products-form-sku-input" value={form.sku} onChange={handleFormChange} required placeholder="EL-001" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div data-testid="products-form-category-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="products-form-category-label">Category</label>
                  <select name="category" data-testid="products-form-category-select" value={form.category} onChange={handleFormChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div data-testid="products-form-price-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="products-form-price-label">Price ($)</label>
                  <input type="number" name="price" data-testid="products-form-price-input" value={form.price} onChange={handleFormChange} required min="0" step="0.01" placeholder="0.00" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div data-testid="products-form-stock-group">
                  <label className="block text-sm font-medium text-slate-700 mb-1" data-testid="products-form-stock-label">Stock</label>
                  <input type="number" name="stock" data-testid="products-form-stock-input" value={form.stock} onChange={handleFormChange} required min="0" placeholder="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              </div>
              <div className="flex gap-3 justify-end" data-testid="products-modal-actions">
                <button type="button" data-testid="products-modal-cancel-btn" onClick={closeModal} className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="products-modal-save-btn" className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                  {editingProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
