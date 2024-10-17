import React from 'react';
import styles from './RecipeCard.module.css';

type RecipeCardProps = {
  id: number;
  imageSrc: string;
  title: string;
  onClick?: (id: number) => void;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ id, imageSrc, title, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div className={styles.recipeCard} onClick={handleClick}>
      <img
        src={imageSrc}
        alt={title}
        className={styles.recipeImage}
      />
      <h3 className={styles.recipeTitle}>{title}</h3>
    </div>
  );
};

export default RecipeCard;