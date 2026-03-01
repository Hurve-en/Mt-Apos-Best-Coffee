import image1 from "../Images/image1.png";
import image4 from "../Images/image4.png";
import image5 from "../Images/image5.png";
import image6 from "../Images/image6.png";
import image7 from "../Images/image7.png";

const productImages = [image1, image4, image5, image6, image7] as const;

export const getProductImage = (
  productName?: string,
  fallback?: string,
  productId?: number | string,
): string => {
  const name = (productName || "").toLowerCase();

  if (name.includes("dark")) return image5;
  if (name.includes("1kg")) return image6;
  if (name.includes("500")) return image4;
  if (name.includes("250")) return image1;

  if (productId !== undefined) {
    const numeric = Number(productId);
    if (Number.isFinite(numeric) && numeric > 0) {
      return productImages[(numeric - 1) % productImages.length];
    }
  }

  if (fallback && !fallback.startsWith("data:")) {
    return fallback;
  }

  return image7;
};
