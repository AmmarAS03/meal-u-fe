import {
  Dispatch,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonInput,
  IonChip,
  IonLabel,
  IonText,
  IonButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { RecipeAction } from "./index";
import { fetchProductDetails, ProductData, useProductList } from "../../../../api/productApi";
import { useParams } from "react-router-dom";
import IconInput from "../../../../components/icon-input";
import SearchIcon from "../../../../../public/icon/search-icon";
import { CreateRecipePayload, IngredientRecipe, usePreparationTypeList, PreparationType } from "../../../../api/recipeApi"
import { useUnitList } from '../../../../api/productApi';
import { useOrder } from '../../../../contexts/orderContext'
import { useAuth } from '../../../../contexts/authContext';
import { useCategoriesList } from '../../../../api/categoryApi';
import { useQueries } from "@tanstack/react-query";

interface IngredientsFormProps {
  state: CreateRecipePayload;
  dispatch: Dispatch<RecipeAction>;
}

const IngredientsForm: React.FC<IngredientsFormProps> = ({
  state,
  dispatch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const { category } = useParams<{ category: string }>();
  const { data: products = [], isFetching: isProductFetching } = useProductList({ search: category });
  const { data: units } = useUnitList();
  const { getUnitFromId, prepTypeMap } = useOrder();

  const [selectedIngredients, setSelectedIngredients] = useState<IngredientRecipe[]>( state.ingredients || [] );
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { data: categories } = useCategoriesList();
  console.log("categories: ", categories);
  console.log("prepTypeMap: ", prepTypeMap);

  const getPreparationTypes = (categoryId: number): PreparationType[] => {
    return prepTypeMap[categoryId] || [];
  };

  function getIdFromCategoryName(name: string): number {
    const result = categories?.find((category) => category.name === name)
    return result!.id;
  }

  

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setShowResults(value.length > 0);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setSearchValue(searchValue);
    }
  };

  const handleSearchIconClick = useCallback(() => {
    setSearchValue(searchValue);
  }, [searchValue]);

  const filterItems = (items: ProductData[], searchTerm: string) => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getUnitId = (product: ProductData) => {
    const data = units!.find(unit => unit.name === product.unit_id);
    return data!.id;
  }

  const handleIngredientSelect = (product: ProductData) => {
    if (!selectedIngredients.some((item) => item.ingredient.product_id === product.id)) {

      const newIngredient: IngredientRecipe = {
        ingredient: {
          product_id: product.id,
          name: product.name,
          unit_id: getUnitId(product),
          unit_size: product.unit_size,
          description: product.description,
        },
        preparation_type: {
          "id": -1,
          "name": "",
          "additional_price": "",
          "category": getIdFromCategoryName(product.category_id),
        },
        quantity: 1,
        price: product.total_price
      };

      setSelectedIngredients((prev) => [...prev, newIngredient]);
      console.log("entered ingridient with category ", newIngredient.preparation_type?.category);
      dispatch({
        type: "SET_FIELD",
        field: "ingredients",
        value: [...selectedIngredients, newIngredient],
      });
    }
    setSearchValue("");
    setShowResults(false);
  };

  const handleIngredientRemove = (ingredientId: number) => {
    const newIngredients = selectedIngredients.filter(
      (item) => item.ingredient.product_id !== ingredientId
    );
    setSelectedIngredients(newIngredients);
    dispatch({
      type: "SET_FIELD",
      field: "ingredients",
      value: newIngredients,
    });
  };

  const handleAmountChange = (id: number, amount: string) => {
    const newIngredients = selectedIngredients.map((item) =>
      item.ingredient.product_id === id ? { ...item, ingredient: { ...item.ingredient, unit_size: amount } } : item
    );
    setSelectedIngredients(newIngredients);
    dispatch({
      type: "SET_FIELD",
      field: "ingredients",
      value: newIngredients,
    });
  };

  const filteredProducts = filterItems(products, searchValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePrepTypeChange = (productId: number, prepId: number) => {
    const updatedIngredients = selectedIngredients.map((item) => {
      if (item.ingredient.product_id === productId) {
        const categoryId = item.preparation_type?.category;
        if (categoryId) {
          const prepTypes = prepTypeMap[categoryId] || [];
          const selectedPrepType = prepTypes.find((type) => type.id === prepId);
          if (selectedPrepType) {
            return {
              ...item,
              preparation_type: {
                id: prepId,
                name: selectedPrepType.name,
                category: selectedPrepType.category,
                additional_price: selectedPrepType.additional_price,
              },
            };
          }
        }
      }
      return item;
    });

    setSelectedIngredients(updatedIngredients);
    dispatch({
      type: "SET_FIELD",
      field: "ingredients",
      value: updatedIngredients,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-4 justify-between items-center mb-4">
        <div className="w-full" ref={searchContainerRef}>
          <IonLabel
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Recipe Ingredients
          </IonLabel>
          <div style={{ position: "relative" }}>
            <IconInput
              onInputHandleChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              rightIcon={<SearchIcon />}
              onRightIconClick={handleSearchIconClick}
              placeholder="Search ingredients"
              width="100%"
              value={searchValue}
            />

            {/* Display search results */}
            {showResults && (
              <div
                className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 max-h-52 overflow-y-auto z-50">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-2 border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => handleIngredientSelect(product)}
                  >
                    {product.name}
                  </div>
                ))}
              </div>
            )}
          </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {selectedIngredients.map((ingredient) => (
          <IonCard key={ingredient.ingredient.product_id}>
            <IonCardHeader>
              <IonCardSubtitle>{ingredient.ingredient.name}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
            <div className="flex items-center gap-x-3">
                    <div className="flex-auto">
                      <IonInput
                        type="number"
                        value={ingredient.ingredient.unit_size}
                        placeholder="Amount"
                        onIonChange={(e) =>
                          handleAmountChange(ingredient.ingredient.product_id, e.detail.value!)
                        }
                        fill="outline"
                      />
                    </div>
                    <div className="flex-none">
                      <IonText>
                        Unit: {getUnitFromId(ingredient.ingredient.unit_id)}
                      </IonText>
                    </div>
                    <div className="flex-none">
                      <IonChip
                        onClick={() => handleIngredientRemove(ingredient.ingredient.product_id)}
                        color="danger"
                      >
                        <IonLabel>Remove</IonLabel>
                      </IonChip>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-3 mt-2">
              <IonSelect
                value={ingredient.preparation_type?.id}
                placeholder="Select preparation type"
                onIonChange={(e) => handlePrepTypeChange(ingredient.ingredient.product_id, e.detail.value)}
              >
                <IonSelectOption value={null}>None</IonSelectOption>
                {ingredient.preparation_type?.category && 
                 prepTypeMap[ingredient.preparation_type.category]?.map((prepType) => (
                  <IonSelectOption key={prepType.id} value={prepType.id}>
                    {prepType.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
            </IonCardContent>
          </IonCard>
        ))}
      </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsForm;
