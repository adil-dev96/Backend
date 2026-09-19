import React, { useEffect, useState, useRef } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useParams, useNavigate } from 'react-router';

const SellerProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const { handleGetProductById, handleAddProductVariant } = useProduct();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] = useState(0);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variants, setVariants] = useState([]);
  const fileInputRef = useRef(null);
  const [newVariant, setNewVariant] = useState({
    attributes: [{ name: '', value: '' }],
    price: '',
    stock: 0,
    images: []
  });

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductById(productId);
      setProduct(data?.product || data);

      const fetchedVariants = data?.variants || data?.product?.variants || [];
      const adaptedVariants = fetchedVariants.map(v => {
        let attrsObj = {};
        if (v.attributes && typeof v.attributes === 'object' && !Array.isArray(v.attributes)) {
          attrsObj = { ...v.attributes };
        } else if (Array.isArray(v.attributes)) {
          v.attributes.forEach(attr => {
            if (attr?.name) attrsObj[attr.name] = attr.value;
          });
        } else {
          if (v.color) attrsObj.Color = v.color;
          if (v.size) attrsObj.Size = v.size;
        }
        return { ...v, attributes: attrsObj };
      });
      setVariants(adaptedVariants);
    } catch (error) {
      console.log("Failed to fetch product details", error);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleAddVariantAttribute = () => {
    setNewVariant({
      ...newVariant,
      attributes: [...newVariant.attributes, { name: '', value: '' }]
    });
  };

  const handleRemoveVariantAttribute = (index) => {
    const newAttributes = newVariant.attributes.filter((_, i) => i !== index);
    setNewVariant({ ...newVariant, attributes: newAttributes });
  };

  const handleUpdateVariantAttribute = (index, field, val) => {
    const newAttributes = [...newVariant.attributes];
    newAttributes[index][field] = val;
    setNewVariant({ ...newVariant, attributes: newAttributes });
  };

  const handleVariantImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentImages = newVariant.images || [];
    const availableSlots = 7 - currentImages.length;
    if (availableSlots <= 0) {
      alert("You can upload a maximum of 7 images per variant.");
      return;
    }

    const filesToAdd = files.slice(0, availableSlots);
    const newImageObjects = filesToAdd.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setNewVariant({
      ...newVariant,
      images: [...currentImages, ...newImageObjects]
    });
    // Reset file input value so same files can be reselected if needed
    e.target.value = '';
  };

  const handleRemoveVariantImage = (indexToRemove) => {
    const updated = (newVariant.images || []).filter((_, idx) => idx !== indexToRemove);
    setNewVariant({
      ...newVariant,
      images: updated
    });
  };

  const handleAddVariant = async () => {
    const validAttributesList = newVariant.attributes.filter(attr => attr.name.trim() && attr.value.trim());

    if (validAttributesList.length === 0) {
      alert("Please add at least one attribute (e.g., Color, Size).");
      return;
    }

    // Convert attributes array to key-value object e.g. { color: "black", size: "M" }
    const attributesObj = {};
    validAttributesList.forEach(attr => {
      attributesObj[attr.name.trim()] = attr.value.trim();
    });

    const variantToAdd = {
      ...newVariant,
      attributes: attributesObj,
      _id: Date.now().toString()
    };

    await handleAddProductVariant(productId, variantToAdd)

    setVariants([...variants, variantToAdd]);

    setNewVariant({
      attributes: [{ name: '', value: '' }],
      price: '',
      stock: 0,
      images: []
    });

    setShowVariantForm(false);
  };

  const handleStockChange = (id, delta) => {
    setVariants(variants.map(v =>
      v._id === id ? { ...v, stock: Math.max(0, parseInt(v.stock || 0) + delta) } : v
    ));
  };

  const handleRemoveVariant = (id) => {
    setVariants(variants.filter(v => v._id !== id));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#110e07] flex items-center justify-center text-[#d4af37]">
        <div className="animate-pulse font-serif text-2xl tracking-widest uppercase">Loading Product...</div>
      </div>
    );
  }

  const totalStock = variants.reduce((acc, curr) => acc + parseInt(curr.stock || 0), 0);

  const formatAttributes = (attrs) => {
    if (!attrs) return 'Standard';
    if (typeof attrs === 'object' && !Array.isArray(attrs)) {
      const entries = Object.entries(attrs);
      if (entries.length === 0) return 'Standard';
      return entries.map(([key, val]) => `${key}: ${val}`).join(' | ');
    }
    if (Array.isArray(attrs)) {
      if (attrs.length === 0) return 'Standard';
      return attrs.map(a => `${a.name || ''}: ${a.value || ''}`).join(' | ');
    }
    return String(attrs);
  };

  return (
    <div className="min-h-screen bg-[#110e07] text-[#eae1d4] font-sans pb-24 selection:bg-[#d4af37] selection:text-[#110e07]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#16130b] border-b border-[#2d2a21] px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[#99907c] text-xs font-semibold tracking-[0.1em] uppercase mb-1 cursor-pointer hover:text-[#d4af37] transition-colors" onClick={() => navigate(-1)}>
            ← Back to Dashboard
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">Product Overview</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-[#d4af37] text-[#110e07] hover:bg-[#f2ca50] transition-colors uppercase tracking-widest text-xs font-bold rounded-sm">
            Save Inventory Changes
          </button>
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-[#16130b] border-b border-[#2d2a21] px-8 py-4 flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          <span className="font-medium text-emerald-400">Active Listing</span>
        </div>
        <div className="w-px h-4 bg-[#2d2a21]"></div>
        <div className="text-[#99907c]">
          Total Stock: <span className="text-[#eae1d4] font-medium">{totalStock} units</span>
        </div>
        <div className="w-px h-4 bg-[#2d2a21]"></div>
        <div className="text-[#99907c]">
          Variants: <span className="text-[#eae1d4] font-medium">{variants.length}</span>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Side: Product Images (Buyer Perspective) */}
        <div className="lg:col-span-5 space-y-4">
          {product.images?.length > 0 ? (
            <>
              <div className="aspect-[4/5] bg-[#16130b] overflow-hidden border border-[#2d2a21]">
                <img src={product.images[activeImage]?.url} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square bg-[#16130b] overflow-hidden border cursor-pointer transition-all ${activeImage === idx ? 'border-[#d4af37]' : 'border-[#2d2a21] opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="aspect-[4/5] bg-[#16130b] border border-[#2d2a21] flex items-center justify-center text-[#99907c]">
              No Images Available
            </div>
          )}
        </div>

        {/* Right Side: Product Info & Variants Manager */}
        <div className="lg:col-span-7">

          {/* Buyer Perspective Info */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-2">{product.title}</h2>
            <p className="text-xl text-[#d0c5af] mb-6">
              {product.price?.currency === 'INR' ? '₹' : '$'}{product.price?.amount}
            </p>
            <p className="text-[#99907c] leading-relaxed max-w-2xl">
              {product.description}
            </p>
          </div>

          {/* Variants & Inventory Section */}
          <div className="border-t border-[#2d2a21] pt-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-serif text-xl font-bold text-white">Variants & Inventory</h3>
              <button
                onClick={() => setShowVariantForm(!showVariantForm)}
                className="px-4 py-2 border border-[#4d4635] text-[#eae1d4] hover:border-[#d4af37] hover:text-[#d4af37] transition-colors text-xs font-semibold tracking-widest uppercase rounded-sm"
              >
                {showVariantForm ? 'Cancel' : '+ Create Variant'}
              </button>
            </div>

            {/* Create Variant Form */}
            {showVariantForm && (
              <section className="bg-[#16130b] border border-[#2d2a21] p-6 mb-8 rounded-sm">
                <h4 className="font-serif text-lg font-semibold mb-6 text-white border-b border-[#2d2a21] pb-4">Add New Variant</h4>

                {/* Dynamic Attributes */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-xs font-semibold tracking-[0.1em] text-[#99907c] uppercase">Variant Attributes (Required)</label>
                    <button
                      onClick={handleAddVariantAttribute}
                      className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase hover:text-[#f2ca50] transition-colors"
                    >
                      + Add Attribute
                    </button>
                  </div>

                  <div className="space-y-4">
                    {newVariant.attributes.map((attr, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={attr.name}
                            onChange={(e) => handleUpdateVariantAttribute(idx, 'name', e.target.value)}
                            placeholder="Name (e.g. Color, Size)"
                            className="w-full bg-transparent border-b border-[#4d4635] pb-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors text-white placeholder-[#4d4635]"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => handleUpdateVariantAttribute(idx, 'value', e.target.value)}
                            placeholder="Value (e.g. Noir, XL)"
                            className="w-full bg-transparent border-b border-[#4d4635] pb-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors text-white placeholder-[#4d4635]"
                          />
                        </div>
                        {newVariant.attributes.length > 1 && (
                          <button
                            onClick={() => handleRemoveVariantAttribute(idx)}
                            className="text-[#ffb4ab] text-xs uppercase tracking-widest hover:text-red-400 p-2"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] text-[#99907c] uppercase mb-2">Price (Optional)</label>
                    <input
                      type="number"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                      placeholder="Override base price"
                      className="w-full bg-transparent border-b border-[#4d4635] pb-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors text-white placeholder-[#4d4635]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] text-[#99907c] uppercase mb-2">Initial Stock</label>
                    <input
                      type="number"
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
                      className="w-full bg-transparent border-b border-[#4d4635] pb-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors text-white placeholder-[#4d4635]"
                    />
                  </div>
                </div>

                {/* Variant Images */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold tracking-[0.1em] text-[#99907c] uppercase">
                      Variant Images (Max 7)
                    </label>
                    <span className="text-xs text-[#99907c] font-mono">
                      {(newVariant.images || []).length}/7 uploaded
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleVariantImageUpload}
                  />

                  <div className="flex flex-wrap gap-3">
                    {(newVariant.images || []).map((img, i) => (
                      <div key={i} className="relative group w-20 h-20 rounded border border-[#d4af37]/60 overflow-hidden bg-[#1f1b13]">
                        <img
                          src={img.url || img}
                          alt={`Variant ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantImage(i)}
                          className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#ffb4ab] text-xs font-bold uppercase tracking-wider"
                          title="Remove image"
                        >
                          Delete
                        </button>
                      </div>
                    ))}

                    {(newVariant.images || []).length < 7 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 border border-dashed border-[#4d4635] bg-[#1f1b13] hover:border-[#d4af37] text-[#99907c] hover:text-[#d4af37] flex flex-col items-center justify-center transition-colors rounded cursor-pointer group"
                      >
                        <span className="text-2xl leading-none font-light group-hover:scale-110 transition-transform">+</span>
                        <span className="text-[10px] tracking-wider uppercase mt-1">Upload</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#99907c] mt-2">
                    Select one or multiple images for this variant. High-resolution PNG or JPG recommended.
                  </p>
                </div>

                <button
                  onClick={handleAddVariant}
                  className="w-full py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#110e07] transition-all uppercase tracking-widest text-xs font-bold rounded-sm"
                >
                  Save Variant
                </button>
              </section>
            )}

            {/* Variants Matrix */}
            <section className="bg-[#16130b] border border-[#2d2a21] overflow-hidden rounded-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#1f1b13] text-[#99907c] text-xs uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Variant</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Stock</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2d2a21]">
                    {variants.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-[#99907c] font-serif italic">
                          No variants added yet.
                        </td>
                      </tr>
                    ) : (
                      variants.map((v) => (
                        <tr key={v._id} className="hover:bg-[#1f1b13]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {v.images && v.images.length > 0 ? (
                                <div className="flex -space-x-2 overflow-hidden py-1">
                                  {v.images.slice(0, 3).map((img, imgIdx) => (
                                    <img
                                      key={imgIdx}
                                      src={img.url || img}
                                      alt="Variant"
                                      className="inline-block h-9 w-9 rounded-sm object-cover border border-[#d4af37]"
                                    />
                                  ))}
                                  {v.images.length > 3 && (
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[#2d2a21] text-[10px] font-bold text-[#d4af37] border border-[#4d4635]">
                                      +{v.images.length - 3}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="w-9 h-9 rounded-sm bg-[#1f1b13] border border-[#2d2a21] flex items-center justify-center text-[10px] text-[#99907c]">
                                  None
                                </div>
                              )}
                              <span className="text-white font-medium">
                                {formatAttributes(v.attributes)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white">
                            {v.price ? `${v.price.currency === 'INR' ? '₹' : '$'}${v.price.amount}` : 'Default'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleStockChange(v._id, -1)}
                                className="w-6 h-6 flex items-center justify-center border border-[#4d4635] text-[#99907c] hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                              >-</button>
                              <span className={`w-8 text-center font-medium ${v.stock <= 5 ? 'text-[#ffb4ab]' : 'text-white'}`}>
                                {v.stock}
                              </span>
                              <button
                                onClick={() => handleStockChange(v._id, 1)}
                                className="w-6 h-6 flex items-center justify-center border border-[#4d4635] text-[#99907c] hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                              >+</button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleRemoveVariant(v._id)}
                              className="text-[#99907c] hover:text-[#ffb4ab] uppercase text-xs tracking-widest font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SellerProductDetails;