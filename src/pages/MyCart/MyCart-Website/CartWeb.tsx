import CartCard from "./CartCard";
import { useCart } from '../../../api/cartApi';
import CartRecipeCard from "./CartRecipeCard";
import CartProductsCard from "./CartProductsCard";

const CartWeb: React.FC = () => {
  const { data: cartData } = useCart();
  
  return (
    <div className="self-stretch flex-col justify-start items-start gap-5 flex">
      <div className="w-full space-y-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Meal Kits</h2>
          {cartData?.mealkits.length ? (
            cartData.mealkits.map((data, index) => (
              <CartCard key={index} data={data} />
            ))
          ) : <div className="text-gray-500">You have no mealkits in your cart</div>
          }
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Recipes</h2>
          {cartData?.recipes.length ? (
            cartData.recipes.map((data, index) => (
              <CartRecipeCard key={index} data={data} isFromMealkit={false}/>
            ))
          ) : <div className="text-gray-500">You have no recipes in your cart</div>
          }
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Products</h2>
          {cartData?.products.length ? (
            cartData.products.map((data, index) => (
              <CartProductsCard key={index} data={data} />
            ))
          ) : <div className="text-gray-500">You have no products in your cart</div>
          }
        </div>
      </div>
    </div>
  );
};

export default CartWeb;