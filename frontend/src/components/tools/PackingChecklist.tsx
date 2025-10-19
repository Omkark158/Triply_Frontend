import React, { useState, useEffect } from 'react';
import { Check, X, Plus, Trash2, Edit2, Save } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
}

interface PackingChecklistProps {
  tripId?: number;
  tripTitle?: string;
}

const CATEGORIES = [
  'Documents',
  'Clothing',
  'Toiletries',
  'Electronics',
  'Medical',
  'Other'
];

const DEFAULT_ITEMS: ChecklistItem[] = [
  // Documents
  { id: '1', text: 'Passport', checked: false, category: 'Documents' },
  { id: '2', text: 'Visa', checked: false, category: 'Documents' },
  { id: '3', text: 'Flight tickets', checked: false, category: 'Documents' },
  { id: '4', text: 'Hotel reservations', checked: false, category: 'Documents' },
  { id: '5', text: 'Travel insurance', checked: false, category: 'Documents' },
  
  // Clothing
  { id: '6', text: 'Shirts/T-shirts', checked: false, category: 'Clothing' },
  { id: '7', text: 'Pants/Jeans', checked: false, category: 'Clothing' },
  { id: '8', text: 'Underwear', checked: false, category: 'Clothing' },
  { id: '9', text: 'Socks', checked: false, category: 'Clothing' },
  { id: '10', text: 'Jacket', checked: false, category: 'Clothing' },
  { id: '11', text: 'Shoes', checked: false, category: 'Clothing' },
  
  // Toiletries
  { id: '12', text: 'Toothbrush & toothpaste', checked: false, category: 'Toiletries' },
  { id: '13', text: 'Shampoo & soap', checked: false, category: 'Toiletries' },
  { id: '14', text: 'Deodorant', checked: false, category: 'Toiletries' },
  { id: '15', text: 'Sunscreen', checked: false, category: 'Toiletries' },
  
  // Electronics
  { id: '16', text: 'Phone charger', checked: false, category: 'Electronics' },
  { id: '17', text: 'Power bank', checked: false, category: 'Electronics' },
  { id: '18', text: 'Camera', checked: false, category: 'Electronics' },
  { id: '19', text: 'Headphones', checked: false, category: 'Electronics' },
  
  // Medical
  { id: '20', text: 'Prescription medications', checked: false, category: 'Medical' },
  { id: '21', text: 'First aid kit', checked: false, category: 'Medical' },
  { id: '22', text: 'Pain relievers', checked: false, category: 'Medical' },
];

const PackingChecklist: React.FC<PackingChecklistProps> = ({ tripId, tripTitle }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Other');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Load from localStorage
  useEffect(() => {
    const storageKey = tripId ? `checklist_${tripId}` : 'checklist_default';
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(DEFAULT_ITEMS);
    }
  }, [tripId]);

  // Save to localStorage
  useEffect(() => {
    if (items.length > 0) {
      const storageKey = tripId ? `checklist_${tripId}` : 'checklist_default';
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, tripId]);

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        checked: false,
        category: selectedCategory,
      };
      setItems([...items, newItem]);
      setNewItemText('');
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const startEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setItems(items.map(item =>
        item.id === id ? { ...item, text: editText.trim() } : item
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const resetChecklist = () => {
    if (window.confirm('Reset checklist to default items?')) {
      setItems(DEFAULT_ITEMS);
    }
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.checked));
  };

  const filteredItems = filterCategory === 'All' 
    ? items 
    : items.filter(item => item.category === filterCategory);

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const totalItems = items.length;
  const checkedItems = items.filter(item => item.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Packing Checklist
          {tripTitle && <span className="text-lg text-gray-600 ml-2">for {tripTitle}</span>}
        </h2>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{checkedItems} of {totalItems} items packed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add New Item */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Add Item</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Enter item name..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Filter & Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory('All')}
            className={`px-3 py-1 rounded-lg ${
              filterCategory === 'All' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({totalItems})
          </button>
          {CATEGORIES.map(cat => {
            const count = items.filter(item => item.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg ${
                  filterCategory === cat 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={clearCompleted}
            className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
          >
            Clear Completed
          </button>
          <button
            onClick={resetChecklist}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">{category}</h3>
            <div className="space-y-2">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    item.checked ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                      item.checked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {item.checked && <Check size={16} className="text-white" />}
                  </button>

                  {editingId === item.id ? (
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(item.id)}
                        className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className={`flex-1 ${
                          item.checked ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {item.text}
                      </span>
                      <button
                        onClick={() => startEdit(item)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items in this category. Add some items to get started!
        </div>
      )}
    </div>
  );
};

export default PackingChecklist;