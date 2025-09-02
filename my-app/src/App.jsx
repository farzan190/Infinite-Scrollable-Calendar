import './App.css'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths ,  startOfWeek, endOfWeek } from "date-fns";
import { useState, useEffect, useRef } from "react";

function App() {
  const [months, setMonths] = useState([]);
  const containerRef = useRef(null);

  
  const generateMonth = (date) => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 }); 
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });     
  return eachDayOfInterval({ start, end });
};

  
  useEffect(() => {
    const current = new Date();
    setMonths([generateMonth(current), generateMonth(addMonths(current, 1))]);
  }, []);

  
  const handleScroll = () => {
    const container = containerRef.current;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      const lastMonthDays = months[months.length - 1];
      const lastDate = lastMonthDays[lastMonthDays.length - 1];
      const nextMonth = addMonths(lastDate, 1);
      setMonths((prev) => [...prev, generateMonth(nextMonth)]);
      console.log(...months);  
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: "500px", overflowY: "auto",  }}
    >
      {months.map((month, idx) => (
        <div key={idx} >
          <h3>{format(month[0], "MMMM yyyy")}</h3>
          <div className="calendar-grid">
            {month.map((day) => (
              <div key={day} className="calendar-day">
                {format(day, "dd")}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
