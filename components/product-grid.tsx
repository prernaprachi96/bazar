(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/components/product-grid.tsx b/components/product-grid.tsx
index d5dcf239a5bd72b136e45ab98b9c101752424ef1..f53c6a0daa103ae790266d2e33feb8e682fd4a92 100644
--- a/components/product-grid.tsx
+++ b/components/product-grid.tsx
@@ -1,51 +1,52 @@
 'use client'
 
 import { ProductCard } from '@/components/product-card'
 import type { Language, Product } from '@/lib/types'
+import { ui } from '@/lib/ui-translations'
 
 interface ProductGridProps {
   title: string
   subtitle?: string
   products: Product[]
   language: Language
   onAdd: (name: string) => void
   emptyMessage?: string
 }
 
 export function ProductGrid({
   title,
   subtitle,
   products,
   language,
   onAdd,
   emptyMessage,
 }: ProductGridProps) {
   return (
     <section aria-label={title} className="flex flex-col gap-3">
       <div>
         <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
 
         {subtitle && (
           <p className="text-xs text-muted-foreground">{subtitle}</p>
         )}
       </div>
 
       {products.length === 0 ? (
         <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
-          {emptyMessage ?? 'No products found in this category yet.'}
+          {emptyMessage ?? ui(language).noProducts}
         </p>
       ) : (
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
           {products.map((product) => (
             <ProductCard
               key={product.id}
               product={product}
               language={language}
               onAdd={onAdd}
             />
           ))}
         </div>
       )}
     </section>
   )
 }
EOF
)
