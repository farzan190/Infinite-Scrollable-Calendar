
import { useState } from "react";
import Calendar from "./Calendar";
import Card from "./Card";
import data from "./assets/data";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div>
      {activeIndex === null ? (
        <Calendar onImageClick={(id) => setActiveIndex(id)} />
      ) : (
        <Card activeIndex={activeIndex} onBack={() => setActiveIndex(null)} />
      )}
    </div>
  );
}
