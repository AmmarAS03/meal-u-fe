import React from 'react';

const SkeletonProductItem: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 15,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        marginBottom: "10px",
      }}
      className="animate-pulse"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "#E0E0E0",
            borderRadius: "10px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "150px",
              height: "10px",
              backgroundColor: "#E0E0E0",
              marginBottom: "4px",
              borderRadius: "5px",
            }}
          />
          <div
            style={{
              width: "70px",
              height: "14px",
              backgroundColor: "#E0E0E0",
              borderRadius: "5px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "78px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "#E0E0E0",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "#E0E0E0",
            borderRadius: "5px",
          }}
        />
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "#E0E0E0",
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
};

export default SkeletonProductItem;