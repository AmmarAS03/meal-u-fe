import React from "react";

interface RecipeIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
  className?: string;
}

const RecipeIcon: React.FC<RecipeIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  selected = false,
  className = "",
}) => {
  return (
    <svg
      className={className}
      fill={selected ? selectedColor : color}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 346.229 346.229"
    >
      <path d="M48.927,8v289.376c0,4.418-3.582,8-8,8c-4.418,0-8-3.582-8-8V8c0-4.418,3.582-8,8-8C45.345,0,48.927,3.582,48.927,8z M313.302,13.248v278.881c0,4.418-3.582,8-8,8H157.681v38.1c0,2.71-1.372,5.236-3.646,6.711c-2.273,1.475-5.139,1.699-7.615,0.594 l-19.782-8.829l-19.799,8.83c-1.041,0.464-2.152,0.694-3.258,0.694c-1.523,0-3.039-0.435-4.355-1.289 c-2.273-1.476-3.645-4.001-3.645-6.711v-38.1H72.9c-4.418,0-8-3.582-8-8V13.248c0-4.418,3.582-8,8-8h232.402 C309.72,5.248,313.302,8.829,313.302,13.248z M141.681,300.128h-30.1v25.773l11.801-5.263c2.074-0.925,4.443-0.926,6.519,0.001 l11.78,5.258V300.128z M297.302,21.248H80.9v262.881h68.782h147.621V21.248z M118.631,138.656c0-17.121,13.929-31.049,31.05-31.049 c2.759,0,5.481,0.363,8.106,1.071c5.423-9.374,15.479-15.388,26.85-15.388c11.161,0,21.324,6.118,26.799,15.402 c2.64-0.717,5.379-1.085,8.156-1.085c17.121,0,31.05,13.929,31.05,31.049c0,17.121-13.929,31.05-31.05,31.05 c-0.649,0-1.295-0.02-1.937-0.059v34.44c0,4.418-3.582,8-8,8h-50.034c-4.418,0-8-3.582-8-8v-34.44 c-0.643,0.04-1.29,0.059-1.94,0.059C132.56,169.706,118.631,155.777,118.631,138.656z M134.631,138.656 c0,8.298,6.751,15.05,15.05,15.05c2.275,0,4.456-0.492,6.483-1.463c2.479-1.188,5.394-1.02,7.72,0.445 c2.326,1.465,3.737,4.021,3.737,6.77v36.63h34.034v-36.63c0-2.749,1.412-5.305,3.738-6.77c2.326-1.464,5.242-1.632,7.72-0.444 c2.025,0.971,4.205,1.463,6.479,1.463c8.299,0,15.05-6.751,15.05-15.05s-6.751-15.049-15.05-15.049 c-2.899,0-5.712,0.825-8.135,2.385c-2.197,1.416-4.946,1.669-7.366,0.677c-2.418-0.991-4.2-3.101-4.772-5.651 c-1.524-6.795-7.699-11.728-14.682-11.728c-6.98,0-13.156,4.933-14.684,11.73c-0.573,2.549-2.355,4.658-4.773,5.648 c-2.418,0.991-5.167,0.738-7.364-0.677c-2.422-1.56-5.235-2.385-8.135-2.385C141.382,123.606,134.631,130.357,134.631,138.656z" />
    </svg>
  );
};

export default RecipeIcon;