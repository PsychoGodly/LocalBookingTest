import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {
  const [eventInfo, setEventInfo] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const handleDateClick = (arg) => {
    // Open a modal or a form to capture user input
    const eventData = {
      start: arg.date,
      end: arg.date, // For simplicity, assuming start and end are the same
      allDay: true, // All-day event by default
    };
    setEventInfo(eventData);
  };

  const handleEventDrop = (arg) => {
    // Update the event's start and end time when dropped on a new cell
    const updatedEvent = {
      ...arg.event.toPlainObject(),
      start: arg.event.start,
      end: arg.event.end,
    };

    const updatedEvents = calendarEvents.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );

    setCalendarEvents(updatedEvents);
  };

  const handleSubmit = (formData) => {
    // Create a new event object with form data
    const newEvent = {
      title: formData.userName,
      roomType: formData.roomType,
      comment: formData.comment,
      start: eventInfo.start,
      end: eventInfo.end,
      allDay: eventInfo.allDay,
      participants: formData.participants,
      color: formData.color,
      id: generateEventId(), // Generate unique id for the event
    };

    // Add the new event to the calendar's events array
    setCalendarEvents([...calendarEvents, newEvent]);

    // Reset eventInfo state
    setEventInfo(null);
  };

  const generateEventId = () => {
    // Simple function to generate a unique id for events
    return Math.random().toString(36).substring(7);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"90vh"}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop} // Handle event drop
        events={calendarEvents} // Pass the events array to the calendar
        editable={true} // Enable event dragging
      />
      {eventInfo && (
        <EventForm eventInfo={eventInfo} onSubmit={handleSubmit} />
      )}
    </div>
  );
}

// Form component for capturing event details
function EventForm({ eventInfo, onSubmit }) {
  const [formData, setFormData] = useState({
    userName: "",
    roomType: "",
    comment: "",
    startDate: eventInfo.start,
    endDate: eventInfo.end,
    participants: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data if needed
    onSubmit(formData);
  };

  return (
    <div className="event-form">
      <h2>New Event</h2>
      <form onSubmit={handleSubmit}>
        <label>User Name:</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        <label>Room Type:</label>
        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
        >
          <option value="">Select Room Type</option>
          <option value="meeting">Meeting Room</option>
          <option value="conference">Conference Room</option>
          <option value="event">Event Space</option>
        </select>
        <label>Comment:</label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
        ></textarea>
        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
        <label>Participants:</label>
        <input
          type="text"
          name="participants"
          value={formData.participants}
          onChange={handleChange}
        />
        <label>Color:</label>
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Calendar;
