import CartCard from "../../../components/CartCardWebsite/CartCard";
import { useCart } from '../../../api/cartApi';
import CartRecipeCard from "../../../components/CartCardWebsite/CartRecipeCard";
import CartProductsCard from "../../../components/CartCardWebsite/CartProductsCard";

const CartWeb: React.FC = () => {
  const { data: cartData } = useCart();

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Meal Kits</h2>
        <div className="space-y-4">
          {cartData?.mealkits.length ? (
            cartData.mealkits.map((data, index) => (
              <CartCard key={index} data={data} />
            ))
          ) : (
            <div className="text-gray-500 py-4">You have no mealkits in your cart</div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recipes</h2>
        <div className="space-y-4">
          {cartData?.recipes.length ? (
            cartData.recipes.map((data, index) => (
              <CartRecipeCard key={index} data={data} isFromMealkit={false}/>
            ))
          ) : (
            <div className="text-gray-500 py-4">You have no recipes in your cart</div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="space-y-4">
          {cartData?.products.length ? (
            cartData.products.map((data, index) => (
              <CartProductsCard key={index} data={data} />
            ))
          ) : (
            <div className="text-gray-500 py-4">You have no products in your cart</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartWeb;