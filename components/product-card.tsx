(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/components/product-card.tsx b/components/product-card.tsx
index cc56a94844db31f36ff5acde70a235609b11d875..ac376797bd17ff2811793dbcbb2cb5723dc24bd8 100644
--- a/components/product-card.tsx
+++ b/components/product-card.tsx
@@ -1,33 +1,35 @@
 'use client'
 
 import { Plus, Tag } from 'lucide-react'
 import { Button } from '@/components/ui/button'
 import { CATEGORY_COLOR } from '@/lib/products'
 import type { Product } from '@/lib/types'
-import { localizeCategory, localizeProductName } from '@/lib/product-translations'
+import { localizeCategory, localizeProductName, localizeProductUnit } from '@/lib/product-translations'
+import { productImageDataUri } from '@/lib/product-visuals'
 import type { Language } from '@/lib/types'
+import { ui } from '@/lib/ui-translations'
 
 interface ProductCardProps {
   product: Product
   language: Language
   onAdd: (name: string) => void
 }
 
 // CHANGED: ₹ conversion
 const USD_TO_INR = 83
 function toRupees(usd: number) {
   return `₹${(usd * USD_TO_INR).toFixed(0)}`
 }
 
 // Use a curated map of food product images from Unsplash (keyword-based, always relevant)
 const PRODUCT_IMAGES: Record<string, string> = {
   'Milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop&auto=format',
   'Almond Milk': 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=80&h=80&fit=crop&auto=format',
   'Oat Milk': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=80&h=80&fit=crop&auto=format',
   'Soy Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop&auto=format',
   'Butter': 'https://images.unsplash.com/photo-1589985270958-bf087b1b7a65?w=80&h=80&fit=crop&auto=format',
   'Cheddar Cheese': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&auto=format',
   'Greek Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop&auto=format',
   'Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=80&h=80&fit=crop&auto=format',
   'Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=80&h=80&fit=crop&auto=format',
   'Bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop&auto=format',
@@ -60,108 +62,109 @@ const PRODUCT_IMAGES: Record<string, string> = {
   'Laundry Detergent': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=80&h=80&fit=crop&auto=format',
   'Trash Bags': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=80&h=80&fit=crop&auto=format',
   'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=80&h=80&fit=crop&auto=format',
   'Ground Beef': 'https://images.unsplash.com/photo-1588347818036-c7a4a1d87d0e?w=80&h=80&fit=crop&auto=format',
   'Salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=80&h=80&fit=crop&auto=format',
   'Bacon': 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=80&h=80&fit=crop&auto=format',
   'Tofu': 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=80&h=80&fit=crop&auto=format',
   'Frozen Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&h=80&fit=crop&auto=format',
   'Ice Cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=80&h=80&fit=crop&auto=format',
   'Frozen Peas': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&h=80&fit=crop&auto=format',
   'Frozen Berries': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=80&h=80&fit=crop&auto=format',
   'Rice': 'https://images.unsplash.com/photo-1536304993881-ff86e0c9fc99?w=80&h=80&fit=crop&auto=format',
   'Pasta': 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=80&h=80&fit=crop&auto=format',
   'Olive Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=80&h=80&fit=crop&auto=format',
   'Cereal': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=80&h=80&fit=crop&auto=format',
   'Peanut Butter': 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=80&h=80&fit=crop&auto=format',
   'Flour': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&h=80&fit=crop&auto=format',
   'Sugar': 'https://images.unsplash.com/photo-1581444093073-37c2d5b6fa79?w=80&h=80&fit=crop&auto=format',
   'Toothpaste': 'https://images.unsplash.com/photo-1609275803894-b14ec6b82a35?w=80&h=80&fit=crop&auto=format',
   'Shampoo': 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=80&h=80&fit=crop&auto=format',
   'Soap': 'https://images.unsplash.com/photo-1584473457493-17c4c24290a5?w=80&h=80&fit=crop&auto=format',
   'Deodorant': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=80&h=80&fit=crop&auto=format',
 }
 
 function getImageUrl(name: string): string {
-  return PRODUCT_IMAGES[name] ?? `https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop&auto=format`
+  return productImageDataUri(name)
 }
 
 export function ProductCard({
   product,
   language,
   onAdd,
 }: ProductCardProps) {
   const productName = localizeProductName(product.name, language)
   const categoryName = localizeCategory(product.category, language)
+  const copy = ui(language)
   
   return (
     <div
       className={`flex items-center gap-3 rounded-2xl border border-border bg-card p-3 ${
         product.outOfStock ? 'opacity-60' : ''
       }`}
     >
       {/* CHANGED: item image using Picsum (always works) */}
       <div className="relative shrink-0 size-10 rounded-full overflow-hidden bg-secondary">
         <img
           src={getImageUrl(product.name)}
           alt={productName}
           width={40}
           height={40}
           className="size-10 rounded-full object-cover"
           onError={(e) => {
             const target = e.currentTarget as HTMLImageElement
             target.style.display = 'none'
             const fallback = target.nextElementSibling as HTMLElement | null
             if (fallback) fallback.style.display = 'flex'
           }}
         />
         {/* Fallback initial circle */}
         <span
           className="hidden absolute inset-0 size-10 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
           style={{ backgroundColor: CATEGORY_COLOR[product.category] }}
           aria-hidden="true"
         >
           {product.name.slice(0, 1)}
         </span>
       </div>
 
       {/* Name + badges */}
       <div className="min-w-0 flex-1">
         <div className="flex flex-wrap items-center gap-2">
           <p className="truncate font-semibold text-card-foreground">{productName}</p>
 
           {product.outOfStock && (
             <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
-              Out of Stock
+              {copy.outOfStock}
             </span>
           )}
 
           {product.onSale && !product.outOfStock && (
             <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
-              <Tag className="size-2.5" aria-hidden="true" /> Sale
+              <Tag className="size-2.5" aria-hidden="true" /> {copy.sale}
             </span>
           )}
         </div>
         <p className="truncate text-xs text-muted-foreground">
-          {product.brand} · {categoryName} · {product.unit}
+          {product.brand} · {categoryName} · {localizeProductUnit(product.unit, language)}
         </p>
       </div>
 
       {/* CHANGED: price in ₹ */}
       <div className="flex shrink-0 flex-col items-end gap-1">
         <span className="font-display text-sm font-bold text-card-foreground">
           {toRupees(product.price)}
         </span>
         <Button
           size="sm"
           className="h-7 rounded-full px-3 text-xs"
           onClick={() => onAdd(product.name)}
           disabled={product.outOfStock}
           aria-label={product.outOfStock ? `${productName} is out of stock` : `Add ${productName} to list`}
         >
           <Plus className="size-3.5" aria-hidden="true" />
-          {product.outOfStock ? 'Unavailable' : 'Add'}
+          {product.outOfStock ? copy.unavailable : copy.add}
         </Button>
       </div>
     </div>
   )
 }
EOF
