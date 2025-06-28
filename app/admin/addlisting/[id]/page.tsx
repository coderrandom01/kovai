'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { validateFormData } from '@/errorValidations/validateFormErrors';
import { isErrorValid } from '@/errorValidations/handleErrors';

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  discount_percent: string;
  discount_price: string;
  display_price: string;
  top_selling: boolean;
  clearance_sale: boolean;
  images: string[];
  status: boolean
  category : any
}
interface ListingErrors {
  title?: string;
  description?: string;
  price?: string;
  discount_percent?: string;
  images?: string;
  category?: string;
}
interface Props {
  params: { id?: string }; // id param is optional for create
}

export default function EditListingPage({ params }: Props) {
  const id = params?.id;
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    price: "",
    discount_percent: "",
    discount_price: "",
    display_price: "",
    top_selling: false,
    clearance_sale: false,
    images: [],
    status : true,
    category : ''
  });
  const [errors, setErrors] = useState<ListingErrors>({
title : "",
  description : "",
  price : "",
  discount_percent : "",
  images : '',
  category : "",
  })

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(!!id);
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);
  // Fetch existing listing if editing
  useEffect(() => {
    if (!id || id === "new"){
        setLoading(false)
        return;
    } 
    setLoading(true);
    fetch(`/api/listings/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          discount_percent: "", // you can calculate from price & discount_price if needed
          discount_price: data.discount_price,
          display_price: data.display_price,
          top_selling: data.top_selling,
          clearance_sale: data.clearance_sale,
          images: data.images || [],
          status: data.status,
          category : data.category
        });
        setImageUrls(data.images || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Calculate discount whenever price or discount_percent changes
  useEffect(() => {
    const discount = +(Number(formData.price) * (Number(formData.discount_percent) || 0) / 100).toFixed(2);
    const display = +(Number(formData.price) - Number(discount)).toFixed(2);

    setFormData(prev => ({
      ...prev,
      discount_price: String(discount),
      display_price: String(display),
    }));
  }, [formData.price, formData.discount_percent]);

  // Rest of your handlers (handleChange, putToS3, handleFiles, removeImage) unchanged, just
  // update to set images in formData/images state

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
    setErrors(prev => ({...prev,[name] : ''}))
  }

  async function putToS3(file: File): Promise<string> {
    const res = await fetch('/api/s3url');
    const { uploadUrl, fileUrl } = await res.json();

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    return fileUrl;
  }

  // async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
  //   const files = e.target.files;
  //   if (!files?.length) return;

  //   setUploading(true);
  //   try {
  //     const urls: string[] = [];
  //     for (const file of Array.from(files)) {
  //       urls.push(await putToS3(file));
  //     }
  //     setImageUrls(prev => [...prev, ...urls]);
  //     setFormData(prev => ({
  //       ...prev,
  //       images: [...prev.images, ...urls],
  //     }));
  //   } finally {
  //     setUploading(false);
  //     e.target.value = '';
  //   }
  // }
  async function uploadImage(file: File) {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: form,
  });

  const { url } = await res.json();
  setErrors(prev => ({...prev,images : ""}))
  return url;
}

  async function uploadMultiple(files: File[]) {
  const urls: string[] = [];

  for (const file of files) {
    const url = await uploadImage(file);
    urls.push(url);
  }

  return urls;
}

const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const urls = await uploadMultiple(files);
    setImageUrls(prev => [...prev, ...urls]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
  };
  function removeImage(url: string) {
    setImageUrls(prev => prev.filter(u => u !== url));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

  const {title ,
  description ,
  price ,
  discount_percent ,
  images ,
  category } = formData
    
    const errors : any = validateFormData('listing', formData);
    setErrors(errors);
if(isErrorValid({title,description,price,discount_percent,images,category},errors)){
  const payload = {
    title:           formData.title,
    description:     formData.description,
    images:          imageUrls,
    price:           Number(formData.price),
    display_price:   Number(formData.display_price),
    discount_price:  Number(formData.discount_price),
    top_selling:     formData.top_selling,
    clearance_sale:  formData.clearance_sale,
    status : formData.status,
    category : formData.category
  };

  const method = id && id !== 'new' ? 'PUT' : 'POST';
  const url = id && id !== 'new' ? `/api/listings/${id}` : '/api/listings';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) {
    alert(id ? 'Listing updated!' : 'Listing created!');
    router.push('/admin/listings'); // or wherever you want to go after
  } else {
    alert('Error saving listing');
  }

}
  }
const checkboxFields: { name: keyof ListingFormData; label: string }[] = [
  { name: 'top_selling', label: 'Top Selling' },
  { name: 'clearance_sale', label: 'Clearance Sale' },
  { name: 'status', label: 'Status' },
];
  if (loading) return <p>Loading...</p>;

  return (
   <section className="mx-auto max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow p-8 text-black dark:text-white">
  <h1 className="text-2xl font-semibold mb-6 text-brand">Add Listing</h1>

  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="block font-medium">Title</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="input border p-2 w-full bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
    {errors.title && <p className='text-red-500 text-sm'>{errors.title}</p>}

    </div>

    <div>
      <label className="block font-medium">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="input h-24 border p-2 w-full bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
    {errors.description && <p className='text-red-500 text-sm'>{errors.description}</p>}

    </div>

    <div>
      <label className="block font-medium">Price</label>
      <input
        type="number"
        step="0.01"
        name="price"
        value={formData.price}
        onChange={handleChange}
        className="input border p-2 w-full bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
    {errors.price && <p className='text-red-500 text-sm'>{errors.price}</p>}

    </div>

    <div>
      <label className="block font-medium">Discount (%)</label>
      <input
        type="number"
        step="0.01"
        name="discount_percent"
        value={formData.discount_percent}
        onChange={handleChange}
        className="input border p-2 w-full bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
    {errors.discount_percent && <p className='text-red-500 text-sm'>{errors.discount_percent}</p>}

    </div>

    <div>
      <label className="block font-medium">Discount Price</label>
      <input
        type="number"
        value={formData.discount_price}
        readOnly
        className="input bg-gray-100 dark:bg-gray-700 border p-2 w-full dark:border-gray-600 dark:text-white"
      />
    </div>

    <div>
      <label className="block font-medium">Display Price (after discount)</label>
      <input
        type="number"
        value={formData.display_price}
        readOnly
        className="input bg-gray-100 dark:bg-gray-700 border p-2 w-full dark:border-gray-600 dark:text-white"
      />
    </div>

    {/* Checkboxes */}
   <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="top_selling"
            checked={formData.top_selling}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="block font-medium text-black dark:text-white">Top Selling</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="clearance_sale"
            checked={formData.clearance_sale}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="block font-medium text-black dark:text-white">Clearance Sale</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="block font-medium text-black dark:text-white">Status</label>
        </div>

    {/* Image uploader */}
    <div>
      <label className="block font-medium mb-1">
        Upload Images
        {uploading && <span className="ml-2 text-sm">(uploading…)</span>}
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={uploading}
        className="dark:text-white"
      />
    {errors.images && <p className='text-red-500 text-sm'>{errors.images}</p>}

      {imageUrls.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-4">
          {imageUrls.map((url) => (
            <li key={url} className="relative group">
              <img
                src={url}
                alt=""
                className="h-24 w-24 object-cover rounded border dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 opacity-90 group-hover:opacity-100"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Category Dropdown */}
    <div>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="border p-2 w-full bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">Select Category</option>
        {categories
          .filter((cat: any) => cat.parent)
          .map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.name} (child of {cat.parent.name})
            </option>
          ))}
      </select>
    {errors.category && <p className='text-red-500 text-sm'>{errors.category}</p>}

    </div>

    <button
      type="submit"
      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {id ? 'Update' : 'Submit'}
    </button>
  </form>
</section>

  );
}


