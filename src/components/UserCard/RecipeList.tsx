import React from 'react';
import {
  CommunityRecipeData,
  useCommunityRecipesList,
} from '../../api/recipeApi';
import CommunityCard from '../../components/CommunityCard/CommunityCard';
import SkeletonCommunityCard from '../../components/CommunityCard/SkeletonCommunityCard';

const RecipeList: React.FC = () => {
  const { data: recipes = [], isFetching } = useCommunityRecipesList();

  if (isFetching) {
    return (
      <>
        <SkeletonCommunityCard />
        <SkeletonCommunityCard />
        <SkeletonCommunityCard />
      </>
    );
  }

  if (recipes.length === 0) {
    return <p>No recipes found.</p>;
  }

  return (
    <div style={{ padding: '20px', marginTop: '10px' }}>
      {recipes.map((recipe: CommunityRecipeData) => (
        <CommunityCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;