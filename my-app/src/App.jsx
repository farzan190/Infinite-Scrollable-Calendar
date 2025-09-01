import './App.css'
import backarrow from "./assets/back.svg";
import {startOfMonth,endOfMonth,eachDayOfInterval,format} from "date-fns";
import {useState} from "react";
function App() {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start , end});
    const [startOfMonthz,setstartOfMonthz]=useState(days)

  return <div className="header">
   <div>{"<"}</div>
  <div>My Hair Diary</div>
  <div>{format(startOfMonthz[2], "dd")}</div>
   <div className="calendar-grid">{startOfMonthz.map(day => (
  <div key={day} className="calendar-day">{format(day, "dd")}</div>
))}</div>
   
  </div>
}

export default App;
