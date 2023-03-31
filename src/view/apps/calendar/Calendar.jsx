import { useEffect, useRef, memo } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = (props) => {
  const calendarRef = useRef(null);

  const {
    store,
    dispatch,
    blankEvent,
    calendarApi,
    selectEvent,
    updateEvent,
    calendarsColor,
    setCalendarApi,
    showModal,
  } = props;

  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi());
    }
  }, [calendarApi]);

  const calendarOptions = {
    events: store.events.length ? store.events : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "prev,next,title",
      end: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      const colorName =
        calendarsColor[calendarEvent._def.extendedProps.calendar];

      return [`bg-light-${colorName}`];
    },

    eventClick({ event: clickedEvent }) {
      dispatch(selectEvent(clickedEvent));
      showModal();
    },

    dateClick(info) {
      const ev = blankEvent;
      ev.start = info.date;
      ev.end = info.date;
      dispatch(selectEvent(ev));
    },

    eventDrop({ event: droppedEvent }) {
      dispatch(updateEvent(droppedEvent));
    },

    eventResize({ event: resizedEvent }) {
      dispatch(updateEvent(resizedEvent));
    },

    ref: calendarRef,
  };

  return <FullCalendar {...calendarOptions} />;
};

export default memo(Calendar);