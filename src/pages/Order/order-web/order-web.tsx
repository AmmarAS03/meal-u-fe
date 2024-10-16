import React, { useState, useEffect, useMemo } from "react";
import { IonPage, IonContent } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { useMealkitList, MealkitData } from "../../../api/mealkitApi";
import { RecipeData, useRecipesList } from "../../../api/recipeApi";
import { ProductData, useProductList, useDietaryDetails, useMealTypeList } from "../../../api/productApi";
import { useOrder } from "../../../contexts/orderContext";
import { useCart } from "../../../api/cartApi";

const OrderWeb: React.FC = () => {
  const router = useIonRouter();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterApplied, setFilterApplied] = useState(false);
  const [dietary, setDietary] = useState<number[]>([]);
  const [mealType, setMealType] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });

  const { data: mealkits = [], isFetching: isMealkitsFetching } = useMealkitList({ search: selectedCategory });
  const { data: recipes = [], isFetching: isRecipesFetching } = useRecipesList({ search: selectedCategory });
  const { data: products = [], isFetching: isProductFetching } = useProductList({ search: selectedCategory });
  const { data: cart } = useCart();
  const { data: dietaryRequirements = [] } = useDietaryDetails();
  const { data: mealTypes = [] } = useMealTypeList();
  const { meal_types } = useOrder();

  const categories = ["All", "Recipes", "Mealkits", "Products"];

  const filterItems = (items: any[], searchTerm: string) => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredMealkits = useMemo(() => filterItems(mealkits, searchValue), [mealkits, searchValue]);
  const filteredRecipes = useMemo(() => filterItems(recipes, searchValue), [recipes, searchValue]);
  const filteredProducts = useMemo(() => filterItems(products, searchValue), [products, searchValue]);

  const filterContent = (content: any[]): any[] => {
    if (!filterApplied) return content;

    return content.filter((item) => {
      const dietaryMatch = dietary.length === 0 || dietary.every(id => 
        item.dietary_details?.includes(dietaryRequirements.find(dr => dr.id === id)?.name)
      );

      const mealTypeMatch = mealType.length === 0 || mealType.every(id => {
        const typeName = meal_types?.find(mt => mt.id === id)?.name;
        return 'meal_type' in item ? item.meal_type.includes(typeName) : 
               'meal_types' in item ? item.meal_types.includes(typeName) : false;
      });

      const priceMatch = ('cooking_time' in item ? item.total_price : item.price) >= priceRange.min && 
                         ('cooking_time' in item ? item.total_price : item.price) <= priceRange.max;

      return dietaryMatch && mealTypeMatch && priceMatch;
    });
  };

  const finalMealkits = useMemo(() => filterContent(filteredMealkits), [filteredMealkits, filterApplied, dietary, mealType, priceRange]);
  const finalRecipes = useMemo(() => filterContent(filteredRecipes), [filteredRecipes, filterApplied, dietary, mealType, priceRange]);
  const finalProducts = useMemo(() => filterContent(filteredProducts), [filteredProducts, filterApplied, dietary, mealType, priceRange]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleItemClick = (itemType: string, itemId: number) => {
    if (itemType === 'mealkit') router.push(`/mealkit-details/${itemId}`);
    if (itemType === 'recipe') router.push(`/recipe-details/${itemId}`);
    if (itemType === 'product') router.push(`/product-details/${itemId}`);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-full ${
                    category === selectedCategory ? "bg-[#7862FC] text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 rounded-full border border-gray-300 flex items-center">
              Filters
              <span className="ml-2 text-[#7862FC]">{filterApplied ? '2' : '0'}</span>
            </button>
          </div>

          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 mb-6"
          />

          <p className="text-gray-600 mb-6">Displaying results for "{searchValue || selectedCategory}"</p>

          {(selectedCategory === "All" || selectedCategory === "Mealkits") && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Mealkits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {isMealkitsFetching ? (
                  <p>Loading mealkits...</p>
                ) : finalMealkits.length > 0 ? (
                  finalMealkits.map((mealkit: MealkitData) => (
                    <div key={mealkit.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={() => handleItemClick('mealkit', mealkit.id)}>
                      <img src={"/img/food-image.png"} alt={mealkit.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2">{mealkit.name}</h3>
                        <div className="flex items-center text-gray-600 text-xs">
                          <span>0 Kcal</span>
                          <span className="mx-2">•</span>
                          <span>0 Min</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No mealkits found.</p>
                )}
              </div>
            </div>
          )}

          {(selectedCategory === "All" || selectedCategory === "Recipes") && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Recipes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {isRecipesFetching ? (
                  <p>Loading recipes...</p>
                ) : finalRecipes.length > 0 ? (
                  finalRecipes.map((recipe: RecipeData) => (
                    <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={() => handleItemClick('recipe', recipe.id)}>
                      <img src={"/img/food-image.png"} alt={recipe.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2">{recipe.name}</h3>
                        <div className="flex items-center text-gray-600 text-xs">
                          <span>0 kcal</span> 
                          <span className="mx-2">•</span>
                          <span>{recipe.cooking_time} Min</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No recipes found.</p>
                )}
              </div>
            </div>
          )}

          {(selectedCategory === "All" || selectedCategory === "Products") && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {isProductFetching ? (
                  <p>Loading products...</p>
                ) : finalProducts.length > 0 ? (
                  finalProducts.map((product: ProductData) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={() => handleItemClick('product', product.id)}>
                      <img src={product.image || "/img/food-image.png"} alt={product.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                        <div className="flex items-center text-gray-600 text-xs">
                          <span>${product.price_per_unit}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderWeb;