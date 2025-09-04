import React, { useState, useEffect } from "react";
import data from "./assets/data";
import { parse, format } from "date-fns";



const Card = React.memo(
  ({ imgUrl, date, description, categories, rating, className }) => (
    <div className={className}>
      <img src={imgUrl} alt="hair diary" />

      <div className="card-content">
        
        <div className="top-row">
          <div className="avatars">
            {categories.slice(0, 2).map((c, i) => (
              <div key={i} className="avatar">
                {c.slice(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
          <div className="rating">
  {Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
  ))}
</div>


        </div>

        
        <h4>{format(parse(date, "dd/MM/yyyy", new Date()), "d MMMM")}</h4>

      
        <p>{description}</p>

        
        <button className="view-btn">View full Post</button>
      </div>
    </div>
  )
);


const Carousel = ({ activeIndex: initialIndex = 0, onBack }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const length = data.length;

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const prevCard = () => setActiveIndex((prev) => (prev - 1 + length) % length);
  const nextCard = () => setActiveIndex((prev) => (prev + 1) % length);

  const getClassName = (index) => {
    if (index === activeIndex) return "card active";
    if (index === (activeIndex - 1 + length) % length) return "card left";
    if (index === (activeIndex + 1) % length) return "card right";
    return "card hidden";
  };

  return (
    <div className="carousel-wrapper" style={{ position: "relative" }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: "30px",
            textAlign: "center",
          }}
        >
          ✕
        </button>
      )}

      <div className="carousel-container">
        <button onClick={prevCard} className="nav-btn left">
          ‹
        </button>
        <div className="carousel">
          {data.map(({ imgUrl, date, description, categories, rating }, index) => (
            <Card
              key={index}
              imgUrl={imgUrl}
              date={date}
              description={description}
              categories={categories}
              rating={rating}
              className={getClassName(index)}
            />
          ))}
        </div>
        <button onClick={nextCard} className="nav-btn right">
          ›
        </button>
      </div>
    </div>
  );
};

export default Carousel;
