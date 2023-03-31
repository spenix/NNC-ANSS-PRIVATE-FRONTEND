import React, { useState, useEffect } from "react";

import { Layout, Row, Col, Card, Button, Drawer } from "antd";
import { RiMenuFill, RiCloseFill } from "react-icons/ri";

// Component
import Calendar from "./Calendar";
import Sidebar from "./Sidebar";
import AddEventSidebar from "./AddEventSidebar";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEvents,
  selectEvent,
  updateEvent,
  updateFilter,
  updateAllFilters,
  addEvent,
  removeEvent,
} from "../../../redux/calendar/calendarActions";

// Colors
const calendarsColor = {
  Travel: "travel",
  Social: "social",
  Work: "work",
  Important: "important",
};

const { Sider, Content } = Layout;

export default function Calender() {
  const [calendarApi, setCalendarApi] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawervisible, setIsDrawerVisible] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const store = useSelector((state) => state.calendar);
  const customise = useSelector(state => state.customise)

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Object
  const blankEvent = {
    title: "",
    start: "",
    end: "",
    allDay: false,
    url: "",
    extendedProps: {
      calendar: "",
      guests: [],
      location: "",
      description: "",
    },
  };

  // RefetchEvents
  const refetchEvents = () => {
    if (calendarApi !== null) {
      calendarApi.refetchEvents();
    }
  };

  // Fetch Events
  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars));
  }, []);

  return (
    <Layout className="hp-calendar hp-mb-32">
      <Drawer
        title=" "
        className="hp-calendar-mobile-menu"
        placement="left"
        closable={true}
        onClose={closeDrawer}
        visible={isDrawervisible}
        closeIcon={
          <RiCloseFill
            className="remix-icon hp-text-color-black-80 hp-text-color-dark-30"
            size={24}
          />
        }
      >
        <Sidebar
          store={store}
          dispatch={dispatch}
          updateFilter={updateFilter}
          updateAllFilters={updateAllFilters}
          showModal={showModal}
          handleOk={handleOk}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
        />
      </Drawer>

      <Content>
        <Row className="hp-calendar-mobile-menu-btn hp-bg-color-black-0 hp-bg-color-dark-100 hp-border-radius hp-py-12 hp-px-sm-8 hp-px-24 hp-mb-16">
          <Button
            className="hp-p-0"
            type="text"
            icon={
              <RiMenuFill
                size={24}
                className="remix-icon hp-text-color-black-80 hp-text-color-dark-30"
              />
            }
            onClick={showDrawer}
          />
        </Row>

        <Card>
          <Row>
            <Sider
              className="hp-border-right-1 hp-border-color-dark-80 hp-py-24 hp-mr-24"
              theme={customise.theme == "light" ? "light" : "dark"}
              width={256}
            >
              <Sidebar
                store={store}
                dispatch={dispatch}
                updateFilter={updateFilter}
                updateAllFilters={updateAllFilters}
                showModal={showModal}
                handleOk={handleOk}
                handleCancel={handleCancel}
                isModalVisible={isModalVisible}
              />
            </Sider>

            <Col flex="1 1" className="hp-py-24">
              <Calendar
                store={store}
                dispatch={dispatch}
                blankEvent={blankEvent}
                calendarApi={calendarApi}
                selectEvent={selectEvent}
                updateEvent={updateEvent}
                calendarsColor={calendarsColor}
                setCalendarApi={setCalendarApi}
                showModal={showModal}
              />
            </Col>
          </Row>
        </Card>

        <AddEventSidebar
          store={store}
          dispatch={dispatch}
          addEvent={addEvent}
          selectEvent={selectEvent}
          updateEvent={updateEvent}
          removeEvent={removeEvent}
          calendarApi={calendarApi}
          refetchEvents={refetchEvents}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          showModal={showModal}
        />
      </Content>
    </Layout>
  );
}
