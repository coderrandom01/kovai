'use client'
import { isErrorValid } from '@/errorValidations/handleErrors';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [status, setStatus] = useState(true);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
const [imageUrl, setImageUrl] = useState('');
const [editId, setEditId] = useState<string | null>(null)
const [error, setError] = useState({name: '',
  parent: '',
  status: '',
  image: '',})
const [formData, setFormData] = useState({
  name: '',
  parent: '',
  status: true,
  image: '',
});
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const isError = isErrorValid(formData,error)
    if(isError){
        setUploading(true);
        const method = editId ? 'PUT' : 'POST';
        const endpoint = editId ? `/api/categories/${editId}` : '/api/categories';
        await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setUploading(false);
        setEditId(null);
        setFormData({
  name: '',
  parent: '',
  status: true,
  image: '',
})
        const updated = await fetch('/api/categories').then(res => res.json());
        setCategories(updated);
    }
  };

  async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: form,
  });

  const { url } = await res.json();
  return url;
}
const handleSingleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;
  const file = e.target.files[0];

  const url = await uploadImage(file);
//   setImageUrl(url); // state for single image
  setFormData((prev) => ({
    ...prev,
    image: url,
  }));
setError((prev) => ({
    ...prev,
    image: "",
  }));
};
const handleChange = (e : any) => {

 const {value , name, checked} = e.target
 setFormData((prev) => ({
    ...prev,[name] : name === "status" ? checked : value
 }))
  setError((prev) => ({
    ...prev,[name] : ""
 }))
 }
const handleDelete = async (
  catId: string,
  catName: string,
  catParent: { name?: string },
  allCategories: typeof categories
) => {
  // Check if this category is a parent to any other category
  const hasChildren = allCategories.some((c : any) => c.parent?._id === catId);

  if (hasChildren) {
    alert(
      `"${catName}" cannot be deleted because it has child categories.\nPlease delete or reassign its children first.`
    );
    return;
  }

  if (confirm(`Are you sure you want to delete "${catName}"?`)) {
    try {
      await fetch(`/api/categories/${catId}`, {
        method: 'DELETE',
      });

      const updated = await fetch('/api/categories').then((res) => res.json());
      setCategories(updated);

      if (editId === catId) {
        setEditId(null);
        setFormData({ name: '', parent: '', status: true, image: '' });
        setImageUrl('');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
};
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Create Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name = "name"
          placeholder="Category name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        {error.name && <p className='text-red-500 text-sm'></p>}
        <select
          value={formData.parent}
          name = 'parent'
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="">Make it a Parent Category</option>
          {categories
            .filter((cat : any) => cat.parent === null)
            .map((cat : any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>

        <input
  type="file"
  accept="image/*"
  onChange={handleSingleFile}
  className="border p-2 w-full"
/>
        {error.image && <p className='text-red-500 text-sm'></p>}

{formData.image && (
  <img src={formData.image} alt="Preview" className="w-16 h-16 mt-2 rounded object-cover" />
)}

        <label className="flex items-center gap-2">
          <input
          name = "status"
            type="checkbox"
            checked={formData.status}
            onChange={handleChange}
          />
          Enabled
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={uploading}
        >
          {editId ? 'Update Category' : 'Create Category'}
        </button>
      </form>

      <h2 className="text-lg font-semibold mt-6">All Categories</h2>
      <ul className="mt-4 space-y-4">
        {categories.map((cat : any) => (
<li key={cat._id} className="flex items-center justify-between gap-4 border p-2 rounded">
  <div className="flex items-center gap-3">
    {cat.image && (
      <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded" />
    )}
    <div>
      <div className="font-semibold">{cat.name}</div>
      <div className="text-sm text-gray-500">
        {cat.parent ? `(Child of ${cat.parent.name})` : '(Parent)'} — {cat.status ? 'Enabled' : 'Disabled'}
      </div>
    </div>
  </div>

  <div className="flex gap-2">
    <button
      onClick={() => {
        setFormData({
          name: cat.name,
          parent: cat.parent?._id || '',
          status: cat.status,
          image: cat.image || '',
        });
        setImageUrl(cat.image || '');
        setEditId(cat._id);
      }}
      className="text-blue-500 hover:underline"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(cat._id, cat.name, cat.parent, categories)}
      className="text-red-500 hover:underline"
    >
      Delete
    </button>
  </div>
</li>

))}
      </ul>
    </div>
  );
}
