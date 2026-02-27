# 🔄 Component Migration Guide - Black & White Design System

## Overview

This guide helps you migrate existing components from the old brown/coffee color palette to the new Awwwards-level black and white design system.

---

## ⚠️ Components Requiring Updates

The following pages and components still use old Tailwind classes and need updating:

### Pages

- [x] `Home.tsx` - Hero, sections, CTA
- [ ] `Menu.tsx` - Product listings
- [ ] `Cart.tsx` - Cart display
- [ ] `Checkout.tsx` - Forms & CTA
- [ ] `Login.tsx` - Auth forms
- [ ] `Register.tsx` - Auth forms
- [ ] `Orders.tsx` - Order listings
- [ ] `Profile.tsx` - User information
- [ ] `AdminDashboard.tsx` - Dashboard
- [ ] `AdminProducts.tsx` - Product management
- [ ] `AdminOrders.tsx` - Order management

### Components

- [ ] `HeroBanner.tsx`
- [ ] `FeaturedProducts.tsx`
- [ ] `ProductCard.tsx`
- [ ] `Footer.tsx`
- [ ] All Auth components

---

## 🔄 Migration Process

### Step 1: Replace Color Tailwind Classes

**OLD → NEW Mapping**

| Old Class              | Old Color           | New Class          | New Color   |
| ---------------------- | ------------------- | ------------------ | ----------- |
| `bg-amber-50`          | Light tan           | `bg-white`         | White       |
| `from-amber-50`        | Tan gradient start  | `from-white`       | White       |
| `to-yellow-50`         | Yellow gradient end | `to-gray-100`      | Light gray  |
| `bg-amber-900`         | Dark brown          | `bg-black`         | Black       |
| `from-amber-900`       | Brown gradient      | `from-black`       | Black       |
| `to-amber-800`         | Brown gradient      | `to-neutral-900`   | Very dark   |
| `text-brown`           | Brown text          | `text-black`       | Black       |
| `text-primary-brown`   | Brown text          | `text-black`       | Black       |
| `text-yellow-50`       | Cream text          | `text-white`       | White       |
| `text-cream`           | Cream text          | `text-white`       | White       |
| `hover:text-amber-900` | Hover brown         | `hover:text-black` | Hover black |

### Step 2: Update Button Classes

**Example: CTA Button**

```tsx
// OLD
<Link to="/menu" className="btn btn-accent btn-lg">
  Shop Now
</Link>

// NEW - Same! Button classes are already updated
<Link to="/menu" className="btn btn-accent btn-lg">
  Shop Now
</Link>
```

The button classes are pre-configured to use black/white, so no changes needed here!

### Step 3: Update Background Gradients

**Example: Hero Section**

```tsx
// OLD
<section className="section-gap bg-gradient-to-b from-amber-50 to-yellow-50">

// NEW
<section className="section-gap bg-gradient-to-b from-white to-neutral-100">
```

**Example: Dark Section (CTA)**

```tsx
// OLD
<section className="section-gap bg-gradient-to-r from-amber-900 to-amber-800 text-cream">

// NEW
<section className="section-gap bg-gradient-to-r from-black to-neutral-900 text-white">
```

### Step 4: Update Text Colors

**Examples:**

```tsx
// OLD
<h2 className="text-brown">Our Best Sellers</h2>

// NEW
<h2 className="text-black">Our Best Sellers</h2>

// OLD
<p className="text-muted text-lg">Description text</p>

// NEW - Can use existing text-muted (already updated to gray-600)
<p className="text-muted text-lg">Description text</p>

// OLD
<p className="text-yellow-50 opacity-90">Light text on dark</p>

// NEW
<p className="text-white opacity-90">Light text on dark</p>
```

### Step 5: Update Search/Replace Patterns

Use this search pattern in your IDE:

**Find & Replace All:**

```
Find:    \bbg-amber-\d+\b|\bfrom-amber-\d+\b|\bto-yellow-\d+\b|\btext-amber-\d+\b|\btext-brown\b|\btext-primary-brown\b|\btext-cream\b|\btext-yellow-\d+\b
Replace: Use mapping table above
```

Or do it manually by section for more control.

---

## 📋 Updated Tailwind Classes Available

### Background Colors

```
bg-white          /* Pure white */
bg-gray-100       /* Very light gray (#f3f4f6) */
bg-neutral-100    /* Light neutral (#f5f5f5) */
bg-neutral-900    /* Dark neutral (#1a1a1a) */
bg-black          /* Pure black */
```

### Text Colors

```
text-black        /* Black text (#000000) */
text-gray-600     /* Gray text */
text-gray-500     /* Lighter gray text */
text-white        /* White text */
text-neutral-900  /* Very dark text */
```

### Gradient Stops

```
from-white        /* Start with white */
from-black        /* Start with black */
to-gray-100       /* End with light gray */
to-neutral-900    /* End with dark neutral */
```

### Opacity

```
opacity-90        /* 90% opacity */
opacity-75        /* 75% opacity */
opacity-50        /* 50% opacity */
```

---

## 🎨 CSS Class Updates

No changes needed for these CSS classes - they're already updated:

✅ `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-accent`, `.btn-lg`, `.btn-sm`
✅ `.card`, `.card-minimal`
✅ `.navbar-*`, `.menu-*`, `.user-*` classes
✅ `.section-gap`
✅ `.container`
✅ `.text-center`, `.text-muted`
✅ All animation classes

---

## 📝 Example: Home Page Migration

### Before

```tsx
<div className="min-h-screen">
  {/* Loading State */}
  {loading && (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      <div className="text-center">
        <div className="animate-pulse mb-4">☕</div>
        <p className="text-primary-brown font-semibold">Loading...</p>
      </div>
    </div>
  )}

  {/* Hero */}
  <HeroBanner />

  {/* Featured Products */}
  <section className="section-gap bg-gradient-to-b from-yellow-50 to-white">
    <div className="container">
      <h2 className="text-brown mb-4">Our Best Sellers</h2>
      <p className="text-muted text-lg">
        Handpicked from Mt. Apo's finest harvest
      </p>
      <FeaturedProducts />
    </div>
  </section>

  {/* CTA Section */}
  <section className="section-gap bg-gradient-to-r from-amber-900 to-amber-800 text-cream">
    <div className="container text-center">
      <h2 className="mb-4">Ready for the Perfect Brew?</h2>
      <Link to="/menu" className="btn btn-accent btn-lg">
        Shop Now
      </Link>
    </div>
  </section>
</div>
```

### After

```tsx
<div className="min-h-screen">
  {/* Loading State */}
  {loading && (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="text-center">
        <div className="animate-pulse mb-4">☕</div>
        <p className="text-black font-semibold">
          Loading premium coffee experience...
        </p>
      </div>
    </div>
  )}

  {/* Hero */}
  <HeroBanner />

  {/* Featured Products */}
  <section className="section-gap bg-gradient-to-b from-white to-gray-100">
    <div className="container">
      <h2 className="text-black mb-4">Our Best Sellers</h2>
      <p className="text-muted text-lg">
        Handpicked from Mt. Apo's finest harvest
      </p>
      <FeaturedProducts />
    </div>
  </section>

  {/* Why Choose Us */}
  <section className="section-gap bg-white">
    <div className="container">
      <h2 className="text-black mb-4">Why Choose Apo Coffee</h2>
      <p className="text-muted text-lg">
        Premium quality meets exceptional service
      </p>
      <WhyChooseUs />
    </div>
  </section>

  {/* Testimonials */}
  <section className="section-gap bg-gradient-to-b from-white to-gray-100">
    <div className="container">
      <h2 className="text-black mb-4">What Our Customers Say</h2>
      <p className="text-muted text-lg">Real reviews from real coffee lovers</p>
      <Testimonials />
    </div>
  </section>

  {/* CTA Section */}
  <section className="section-gap bg-gradient-to-r from-black to-neutral-900 text-white">
    <div className="container text-center">
      <h2 className="mb-4">Ready for the Perfect Brew?</h2>
      <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
        Explore our complete collection of premium Mt. Apo coffee
      </p>
      <Link to="/menu" className="btn btn-accent btn-lg">
        Shop Now
      </Link>
    </div>
  </section>
</div>
```

---

## 🎯 Priority Migration Order

1. **Critical Pages** (User-facing)
   - `Home.tsx` - Homepage
   - `Menu.tsx` - Product catalog
   - `Cart.tsx` - Shopping experience
   - `Checkout.tsx` - Purchase flow

2. **Auth Pages**
   - `Login.tsx`
   - `Register.tsx`
   - `AdminLogin.tsx`

3. **Secondary Pages**
   - `Orders.tsx`
   - `Profile.tsx`
   - `OrderDetail.tsx`

4. **Admin Pages**
   - `AdminDashboard.tsx`
   - `AdminProducts.tsx`
   - `AdminOrders.tsx`

---

## ✅ Verification Checklist

After updating each component, verify:

- [ ] All brown/amber colors replaced
- [ ] All yellow/cream colors replaced
- [ ] Headings are black
- [ ] Body text uses `text-muted` (gray)
- [ ] CTA buttons still work
- [ ] Dark sections use `from-black to-neutral-900`
- [ ] White text on dark backgrounds
- [ ] Buttons have proper contrast
- [ ] Links are understandable
- [ ] Component looks clean and modern

---

## 🔍 Testing Across Devices

After each component update:

1. **Desktop (1280px+)**
   - Full layout visible
   - Buttons accessible
   - Typography readable

2. **Tablet (768px)**
   - Stack properly
   - Touch targets 44px+
   - Spacing adequate

3. **Mobile (375px)**
   - Single column
   - Full width elements
   - Proper line heights

4. **Dark Mode** (if supported)
   - Test contrast
   - Text remains readable
   - Backgrounds appropriate

---

## 💡 Pro Tips

1. **Use VS Code Find & Replace** with regex patterns for bulk updates
2. **Test one page at a time** rather than all at once
3. **Screenshot before & after** to verify changes
4. **Check mobile responsiveness** on each update
5. **Use browser DevTools** to verify computed colors
6. **Commit changes incrementally** (one component per commit)

---

## 🎨 Design Consistency Tips

- **Use the CSS variable system** whenever possible
- **Avoid hardcoded colors** - always use class names
- **Keep shadow system consistent** - use `.shadow`, `.shadow-lg`, etc.
- **Maintain spacing scale** - use space variables
- **Preserve animations** - they're pre-configured

---

## 📞 Need Help?

Refer to these files:

- `DESIGN_SYSTEM.md` - Complete design documentation
- `src/styles/premium.css` - Component styles
- `tailwind.config.ts` - Tailwind color configuration
- `src/index.css` - Global styles

---

**Status**: Awaiting component migration  
**Last Updated**: February 27, 2026  
**Design System**: Awwwards-Level Black & White v1.0
