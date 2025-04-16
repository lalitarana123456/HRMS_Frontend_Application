import React, {useState, useEffect} from 'react'
import axios from 'axios'

const UpcomingEvents = () => {

  const [event, setEvent] = useState([]);

  useEffect(() => {
    const getUpcomingEvents = async() =>
    {
      try
      {
        const response = await axios.get("http://localhost:5000/api/v1/upcomingevent/events");
        setEvent(response.data.events);
      }
      catch(error)
      {
        console.log("Error Fetching Event:", error);
      }
    };
    getUpcomingEvents();
  }, []);

  return (
    <div 
    className='w-full h-full border-2 rounded-[10px] lg:rounded-[16px] flex items-center flex-col justify-center bg-[#FFFCFC] drop-shadow-lg'>
      <span className='lg:mb-3 lg:mt-4 my-1 lg:text-sm text-xs font-bold'>Upcoming Events</span>
      <div 
      className='w-[95%] lg:h-[92%] h-[147px] md:h-[200px] rounded-[10px] border-2 bg-[#E7F1EF] flex items-center gap-1 flex-col lg:p-1 p-0.5 lg:mb-2 mb-1 overflow-y-auto'>
         {event.map((event) => (
        <div key={event} className='w-full lg:h-[50px] h-[30px] border-[1px] lg:border-[2px] border-white bg-[#D0DAFF] lg:rounded-[15px] rounded-[10px] flex items-center'>
          <span className='flex items-center gap-1 ml-2'>
            {/* <img 
            className='lg:w-[27px] lg:h-[27px] w-[20px] h-[20px] rounded-full border border-black' src="" alt="" /> */}
            <span className='font-bold'>
              <h1 className='lg:text-[12px] text-[10px]'>{event.title}</h1>
              <h4 className='lg:text-[10px] text-[8px]'>{event.description}</h4>
              {/* <h4 className='lg:text-[10px] text-[8px]'>{event.date}</h4> */}
            </span>
          </span>
        </div>
         ))}
      </div>
    </div>
  )
}

export default UpcomingEvents