import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: '94th Annual Gathering',
      date: '10th Falgun, 1431',
      time: '10:00 AM',
      location: 'Madaripur Ancestral Home',
      description: 'The grand annual gathering of the Bhagoban Chandra Barai descendants. A day of bonding, feast, and cultural programs.'
    },
    {
      id: 2,
      title: 'Regional Meetup - Dhaka',
      date: 'March 15, 2026',
      time: '04:00 PM',
      location: 'Ramna Park, Dhaka',
      description: 'A casual meetup for members residing in Dhaka to discuss community welfare and networking.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 animate-slide-up">
        <h1 className="text-4xl font-serif font-bold text-primary">Community Events</h1>
        <p className="text-xl text-stone-500">Join us in celebrating our heritage and unity.</p>
      </div>

      <div className="grid gap-6">
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 flex flex-col md:flex-row gap-6 hover:shadow-lg hover:-translate-y-1 transition duration-300 animate-slide-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="bg-orange-100 p-6 rounded-lg flex flex-col items-center justify-center min-w-[150px] text-primary group">
              <Calendar className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-bold text-center">{event.date}</span>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-serif font-bold text-stone-800 hover:text-primary transition-colors cursor-pointer">{event.title}</h2>
              <p className="text-stone-600">{event.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
              </div>
              <button className="mt-2 bg-secondary text-white px-4 py-2 rounded hover:bg-red-900 hover:shadow-md transition text-sm transform hover:scale-105 active:scale-95 duration-200">
                Register / RSVP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
