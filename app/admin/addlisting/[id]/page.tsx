'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
}

interface Props {
  params: { id?: string }; // id param is optional for create
}

export default function EditListingPage({ params }: Props) {
  const id = params?.id;
  const router = useRouter();

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
    status : true
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(!!id);

  // Fetch existing listing if editing
  useEffect(() => {
    console.log("AWS creds:", {
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET_NAME,
  keyId: process.env.AWS_ACCESS_KEY_ID,
});
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
          status: data.status
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
    console.log('Uploaded image URLs:', urls);
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
  if (!formData.title.trim()) {
    return alert('Title is required.');
  }

  if (!formData.description.trim()) {
    return alert('Description is required.');
  }

  if (!imageUrls || imageUrls.length === 0) {
    return alert('Please upload at least one image.');
  }

  if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
    return alert('Valid price is required.');
  }
    const payload = {
      title:           formData.title,
      description:     formData.description,
      images:          imageUrls,
      price:           formData.price,
      display_price:   formData.display_price,
      discount_price:  formData.discount_price,
      top_selling:     formData.top_selling,
      clearance_sale:  formData.clearance_sale,
      status : formData.status
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

  if (loading) return <p>Loading...</p>;

  return (
    <section className="mx-auto max-w-xl bg-white rounded-xl shadow p-8">
      <h1 className="text-2xl font-semibold mb-6 text-brand">Add Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-black">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block font-medium text-black">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input h-24"
          />
        </div>

        <div>
          <label className="block font-medium text-black">Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block font-medium text-black">Discount (%)</label>
          <input
            type="number"
            step="0.01"
            name="discount_percent"
            value={formData.discount_percent}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label className="block font-medium text-black">Discount Price</label>
          <input
            type="number"
            value={formData.discount_price}
            readOnly
            className="input bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium text-black">Display Price (after discount)</label>
          <input
            type="number"
            value={formData.display_price}
            readOnly
            className="input bg-gray-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="top_selling"
            checked={formData.top_selling}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="block font-medium text-black">Top Selling</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="clearance_sale"
            checked={formData.clearance_sale}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="block font-medium text-black">Clearance Sale</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="block font-medium text-black">Status</label>
        </div>

        {/* Image uploader */}
        <div>
          <label className="block font-medium mb-1">
            Upload Images
            {uploading && <span className="ml-2 text-sm  text-black">(uploading…)</span>}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={uploading}
          />
          {imageUrls.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-4">
              {imageUrls.map(url => (
                <li key={url} className="relative group">
                  <img src={url} alt="" className="h-24 w-24 object-cover rounded" />
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

        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-50"
          // disabled={uploading || imageUrls.length === 0 && formData.price !== 0 || !formData.price && formData.title.length > 0}
        >
         {id ? "Update" : "Submit"}
        </button>
      </form>
    </section>
  );
}
