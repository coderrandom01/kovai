'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);

  async function fetchListings() {
    const res = await fetch('/api/listings');
    const data = await res.json();
    setListings(data);
  }

  async function handleDelete(id: string) {
    const confirmed = confirm('Are you sure you want to delete this listing?');
    if (!confirmed) return;

    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    fetchListings(); // Refresh the list
  }

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <section className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Listings</h1>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Discount</th>
            <th className="p-2 border">Display Price</th>
            <th className="p-2 border">Top Selling</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((item : any) => (
            <tr key={item._id} className="text-center">
              <td className="p-2 border">{item.title}</td>
              <td className="p-2 border">₹{item.price}</td>
              <td className="p-2 border">₹{item.discount_price}</td>
              <td className="p-2 border">₹{item.display_price}</td>
              <td className="p-2 border">{item.status ? 'Yes' : 'No'}</td>
              <td className="p-2 border space-x-2">
                <Link href={`addlisting/${item._id}`} className="text-blue-600 underline">Edit</Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
