// EventsTab.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';


const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);



  const {id} =useParams();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/events/${id}`);
      console.log("Fetched Events:", response.data);

      // Safely set events only if it's an array
      if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else if (response.data.events && Array.isArray(response.data.events)) {
        setEvents(response.data.events);
      } else {
        console.error("Unexpected response format:", response.data);
        setEvents([]); // fallback to empty array
      }

    } catch (e) {
      console.log(`Error fetching the events! ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {loading && <div>Fetching the Events!</div>}


        {/* Top section: Title + Create Event button */}
  {!loading && (<div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">Events</h2>
    <a
      href={`/create/${id}/event`} // Use correct route
      className="bg-[#3b5998] text-white px-2 py-1 rounded hover:bg-[#3a3191]"
    >
      + Create Event
    </a>
  </div>
  )}

      {!loading && events.length > 0 ? (
        events.map((event) => (
          <div key={event._id} className="mb-6 border rounded shadow">
            <div className="bg-[#3b5998] text-white p-4 rounded-t text-xl font-semibold">
              {event.title}
            </div>
            <div className="p-4 bg-white">
              <p className="text-lg font-medium">{event.message}</p>
              <p className="text-sm text-gray-700 mt-1">
                Date: {new Date(event.time).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })} • {new Date(event.time).toLocaleTimeString([], {
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
              {event.tags?.length > 0 && (
                <p className="text-sm mt-1 text-gray-600">
                  Tags: {event.tags.join(', ')}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                {/* <button className="bg-[#4B3FA7] text-white px-4 py-1 rounded">Going</button>
                <button className="border px-4 py-1 rounded">Interested</button>
                <button className="border px-4 py-1 rounded">Share</button> */}
              </div>
            </div>
          </div>
        ))
      ) : (
        !loading && <p>No events available</p>
      )}
    </div>
  );
};

export default Events;
