import ArrowDownIcon from "../../../../public/icon/arrow-down";
import ArrowUpIcon from "../../../../public/icon/arrow-up";
import styles from "./cart.module.css";
import { useState } from "react";
import { RecipeData } from "../../../api/recipeApi";


import CollapsibleRecipeCard from "./collapsible-recipe-card";
import { MealkitData } from "../../../api/mealkitApi";

interface CollapsibleMealkitCardProps {
  data: MealkitData;
}

const CollapsibleMealkitCard: React.FC<CollapsibleMealkitCardProps> = ({
  data
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className={styles.card}>
      <div className={styles.row_card_content}>
        <div className={styles.column}>
          <img
            src={data.image ? data.image : "/img/no-photo.png"}
            style={{
              borderRadius: "10px",
              width: "100%",
              height: "auto",
              objectFit: "cover",
              maxWidth: "60px",
              maxHeight: "60px",
            }}
          />
        </div>
        <div className={styles.column_middle}>
          <div className={styles.card_title}>
            <p style={{ fontSize: "11px", fontWeight: "600" }}>
              {data.name.length > 20 ? `${data.name.slice(0, 20)}...` : data.name}
            </p>
          </div>
          <div className={styles.dietary_details}>
            {data.dietary_details && Object.values(data.dietary_details).map((detail, index) => (
              <div key={index} className={styles.node}>
                {detail}
              </div>
            ))}
          </div>
          <div className={styles.price}>${data.total_price}</div>
        </div>
        <div className={styles.column} onClick={toggleExpand}>
          {isExpanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </div>
      </div>
      {isExpanded ? (
        <div className="expanded_content">
          {data.recipes.map((data, index) => (
            <CollapsibleRecipeCard
              key={index}
              data={data}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CollapsibleMealkitCard;
