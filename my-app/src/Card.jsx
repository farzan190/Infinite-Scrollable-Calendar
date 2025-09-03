import React, { useState } from "react";
import data from "./assets/data";


const Card = React.memo(({ imgUrl, date, description, categories, rating, className }) => (
  <div className={className}>
    <img src={imgUrl} alt="hair diary" /> 
    <div className="card-content">
      <h4>{date}</h4>
      <p>{description}</p>
      <div className="categories">
        {categories.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <p className="rating">⭐ {rating}</p>
    </div>
  </div>
));

const Carousel=()=> {
  const [activeIndex, setActiveIndex] = useState(1);
  const length = data.length;

  const prevCard = () => setActiveIndex((prev) => (prev - 1 + length) % length);
  const nextCard = () => setActiveIndex((prev) => (prev + 1) % length);

  const getClassName = (index) => {
    if (index === activeIndex) return "card active";
    if (index === (activeIndex - 1 + length) % length) return "card left";
    if (index === (activeIndex + 1) % length) return "card right";
    return "card hidden"; 
  };

  return (
    <div className="carousel-container">
      <button onClick={prevCard} className="nav-btn left">‹</button>
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
      <button onClick={nextCard} className="nav-btn right">›</button>
    </div>
  );
}

export default Carousel;
