import React from 'react';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useOrderDetails } from '../../../api/warehouseApi';
import { format, parseISO } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import Receipt from '../../../components/Warehouse/Receipt/Receipt';
import ReactDOMServer from 'react-dom/server';
import { arrowBack } from 'ionicons/icons';

const PreparationTypePill: React.FC<{ type: string }> = ({ type }) => (
  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
    {type}
  </span>
);

const OrderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: orderDetails, isLoading, error } = useOrderDetails(parseInt(id));
    
    const handleBackClick = () => {
        history.back();
      };

    const printReceipt = () => {
      if (!orderDetails) return;
  
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
  
      const htmlContent = ReactDOMServer.renderToString(<Receipt orderDetails={orderDetails} />);
  
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .bg-white { background-color: white; }
              .p-4 { padding: 1rem; }
              .w-80 { width: 20rem; }
              .text-sm { font-size: 0.875rem; }
              .text-center { text-align: center; }
              .mb-4 { margin-bottom: 1rem; }
              .text-xl { font-size: 1.25rem; }
              .font-bold { font-weight: bold; }
              .list-disc { list-style-type: disc; }
              .list-inside { list-style-position: inside; }
              .pl-4 { padding-left: 1rem; }
              .text-xs { font-size: 0.75rem; }
              .border-t { border-top-width: 1px; }
              .pt-2 { padding-top: 0.5rem; }
              .mt-4 { margin-top: 1rem; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .mt-2 { margin-top: 0.5rem; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
  
      printWindow.document.close();
      printWindow.focus();
  
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!orderDetails) return <div>No order details found.</div>;
  
    const orderStatusMap: { [key: number]: string } = {
      1: 'Pending',
      2: 'Processing',
      3: 'Ready to Deliver',
      4: 'Out for Delivery',
      5: 'Delivered',
      6: 'Cancelled'
    };
  
    return (
      <IonPage>
        <IonContent className="font-sans">
          <div className="p-6 pl-24 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                <div className="flex flex-row justify-center items-center">
                    <button 
                      onClick={handleBackClick}
                      className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                      <IonIcon icon={arrowBack} className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                  </div>
                  <button 
                    className="bg-[#7862FC] text-white font-semibold py-2 px-4 rounded-2xl"
                    onClick={printReceipt}
                  >
                    Print Receipt
                  </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600">Order Status</p>
                  <p className="font-semibold">{orderStatusMap[orderDetails.order_status] || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-semibold">${orderDetails.total}</p>
                </div>
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-semibold">{format(parseISO(orderDetails.created_at), 'dd MMM yyyy, HH:mm')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p className="font-semibold">{`${orderDetails.user_id.first_name} ${orderDetails.user_id.last_name}`}</p>
                </div>
              </div>

              {orderDetails.meal_kits.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mb-3">Meal Kits</h3>
                  <table className="w-full mb-6">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Kit</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orderDetails.meal_kits.map((mealKit, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{mealKit.mealkit_name}</td>
                          <td className="px-4 py-2">{mealKit.quantity}</td>
                          <td className="px-4 py-2">${mealKit.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {orderDetails.recipes.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mb-3">Recipes</h3>
                  <table className="w-full mb-6">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipe</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orderDetails.recipes.map((recipe, recipeIndex) => (
                        <React.Fragment key={recipeIndex}>
                          <tr>
                            <td className="px-4 py-2 font-medium">{recipe.recipe_name}</td>
                            <td className="px-4 py-2">{recipe.quantity}</td>
                            <td className="px-4 py-2">${recipe.total}</td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-4 py-2 bg-gray-50">
                              <p className="font-medium mb-2">Ingredients:</p>
                              <ul className="list-disc list-inside">
                                {recipe.ingredients.map((ingredient, ingredientIndex) => (
                                  <li key={ingredientIndex} className="mb-1">
                                    {ingredient.ingredient_name} - {ingredient.quantity} x {ingredient.unit_size} {ingredient.unit_name}
                                    {ingredient.preparation_type && (
                                      <span className="ml-2">
                                        <PreparationTypePill type={ingredient.preparation_type} />
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {orderDetails.products.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mb-3">Products</h3>
                  <table className="w-full mb-6">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orderDetails.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{product.product_name}</td>
                          <td className="px-4 py-2">{product.quantity}</td>
                          <td className="px-4 py-2">${product.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <h3 className="text-xl font-semibold mb-3">Delivery Details</h3>
              {orderDetails.delivery_details.map((detail, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-semibold">Location:</span> {detail.delivery_location.name} - {detail.delivery_location.branch}</p>
                      <p><span className="font-semibold">Address:</span> {detail.delivery_location.address_line1}, {detail.delivery_location.city}</p>
                      <p><span className="font-semibold">Delivery Time:</span> {detail.delivery_time.name} ({detail.delivery_time.start_time} - {detail.delivery_time.end_time})</p>
                      <p><span className="font-semibold">Delivery Date:</span> {detail.delivery_date}</p>
                      <p><span className="font-semibold">Locker Number:</span> {detail.locker_number || 'Not assigned'}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      {detail.qr_code ? (
                        <>
                          <QRCodeSVG value={detail.qr_code} size={128} />
                          <p className="mt-2 text-sm text-gray-500">Scan QR Code</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">QR Code not generated yet</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden">
          <Receipt orderDetails={orderDetails} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderDetail;