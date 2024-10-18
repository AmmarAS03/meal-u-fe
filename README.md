# MealU Front End

MealU addresses the difficulty of providing university students with easy access to healthy, locally-sourced meals. Due to their hectic schedules, many students struggle to find time to prepare healthy meals and frequently rely on fast foods.

## Features

- **Role-based permissions**: Role-specific access for different user types, including `Client`, `Warehouse`, and `Courier`
- **Ingredient Management**: Full CRUD (Create, Read, Update, Delete) operations for managing ingredients, with dynamic pricing based on freshness, preparation type, and supplier data.
- **Recipe and Meal Kit Management**: Allows users to create, customize, and manage recipes and meal kits. Includes detailed nutritional information for each meal kit, such as calories, macronutrients, and dietary tags.
- **Order Management**: Order management system with features including cart functionality, checkout process, order tracking, and delivery status updates.
- **Customizable Nutrition and Dietary Preferences**: Users can set and update their dietary preferences and allergies.
- **Community Engagement System**: Support for recipe sharing and social interactions, allowing users to like, and comment recipes.
- **Incentive and Reward System**: Logic for tracking recipe popularity and issuing rewards to users when their shared recipes reach a certain threshold of likes or orders.
- **Secure Delivery and Pickup Management**: Manage secure pickups from designated campus locker locations. Uses QR codes or passcodes for locker access.

## Tech Stack

- React
- Ionic
- Vite
- Tailwind
- Vercel Deployment

### Build

- Gradle

## Installation

To install and set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AmmarAS03/meal-u-fe
   cd meal-u-fe
   ```

2. **Install dependencies:**

   ```bash
   npm ci
   ```

3. **Set up environment variables**
   - Create `.env` files and fill in with the appropriate values. See configuration section for the keys.
4. **Run the development server:**

   ```bash
   npm run dev
   ```

## Configuration

Ensure the following configurations are set correctly in your `.env` file:

```
VITE_MAPTILER_API_KEY=
VITE_API_BASE_URL=
```

## Deployment

To deploy the project on Vercel, you should refer to the [Vercel documentation](https://vercel.com/docs/deployments/overview).
