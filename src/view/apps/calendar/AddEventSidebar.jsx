import { Fragment, useState } from "react";

import Select, { components } from "react-select";
import "flatpickr/dist/themes/light.css";
import Flatpickr from "react-flatpickr";
import { useForm } from "react-hook-form";
import { RiCloseFill } from "react-icons/ri";
import { Button, Input, Form, Modal, Badge, Row, Col } from "antd";

export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

const { TextArea } = Input;

const AddEventSidebar = (props) => {
  const {
    store,
    dispatch,
    addEvent,
    selectEvent,
    updateEvent,
    removeEvent,
    calendarApi,
    refetchEvents,
    handleCancel,
    isModalVisible,
    setIsModalVisible,
    showModal,
  } = props;

  const selectedEvent = store.selectedEvent;
  const { errors, handleSubmit } = useForm();

  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [endPicker, setEndPicker] = useState(new Date());
  const [startPicker, setStartPicker] = useState(new Date());
  const [value, setValue] = useState([{ value: "Travel", label: "Travel" }]);

  const options = [
    { value: "Travel", label: "Travel", badge: "#C903FF" },
    { value: "Social", label: "Social", badge: "#00F7BF" },
    { value: "Work", label: "Work", badge: "#FFC700" },
    { value: "Important", label: "Important", badge: "#FF0022" },
  ];

  const OptionComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <Badge color={data.badge} />
        {data.label}
      </components.Option>
    );
  };

  // Adds New Event
  const handleAddEvent = () => {
    const obj = {
      title,
      start: startPicker,
      end: endPicker,
      allDay,
      display: "block",
      extendedProps: {
        calendar: value[0].label,
        desc: desc.length ? desc : undefined,
      },
    };
    dispatch(addEvent(obj));
    refetchEvents();
    handleCancel();
  };

  // Reset Input Values on Close
  const handleResetInputValues = () => {
    dispatch(selectEvent({}));
    setTitle("");
    setDesc("");
    setValue([{ value: "Travel", label: "Travel" }]);
    setStartPicker(new Date());
    setEndPicker(new Date());
    setIsModalVisible(false);
  };

  // (UI) updateEventInCalendar
  const updateEventInCalendar = (
    updatedEventData,
    propsToUpdate,
    extendedPropsToUpdate
  ) => {
    const existingEvent = calendarApi.getEventById(updatedEventData.id);

    // Set event properties except date related
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index];
      existingEvent.setProp(propName, updatedEventData[propName]);
    }

    // Set date related props
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, {
      allDay: updatedEventData.allDay,
    });

    // Set event's extendedProps
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index];
      existingEvent.setExtendedProp(
        propName,
        updatedEventData.extendedProps[propName]
      );
    }
  };

  // Updates Event in Store
  const handleUpdateEvent = () => {
    const eventToUpdate = {
      id: selectedEvent.id,
      title,
      allDay,
      start: startPicker,
      end: endPicker,
      extendedProps: {
        description: desc,
        calendar: value[0].label,
      },
    };

    const propsToUpdate = ["id", "title"];
    const extendedPropsToUpdate = ["calendar", "description"];

    dispatch(updateEvent(eventToUpdate));
    updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate);
    setIsModalVisible(false);
  };

  // (UI) removeEventInCalendar
  const removeEventInCalendar = (eventId) => {
    calendarApi.getEventById(eventId).remove();
  };

  const handleDeleteEvent = () => {
    dispatch(removeEvent(selectedEvent.id));
    removeEventInCalendar(selectedEvent.id);
    setIsModalVisible(false);
  };

  const FooterAddOrUpdate = () => {
    if (
      isObjEmpty(selectedEvent) ||
      (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)
    ) {
      return (
        <Fragment>
          <Button
            onClick={() => {
              handleAddEvent();
              handleResetInputValues();
            }}
            type="primary"
            block
          >
            Add
          </Button>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Button
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
              handleResetInputValues();
              handleUpdateEvent();
            }}
            block
          >
            Update
          </Button>
        </Fragment>
      );
    }
  };

  const FooterCancelOrDelete = () => {
    if (
      isObjEmpty(selectedEvent) ||
      (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)
    ) {
      return (
        <Fragment>
          <Button
            onClick={() => {
              handleResetInputValues();
            }}
            type="primary"
            block
            ghost
          >
            Cancel
          </Button>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Button
            type="danger"
            onClick={() => {
              setIsModalVisible(true);
              handleResetInputValues();
              handleDeleteEvent();
            }}
            block
            ghost
          >
            Delete
          </Button>
        </Fragment>
      );
    }
  };

  const modalTitle = (
    <h5 className="modal-title">
      {selectedEvent && selectedEvent.title && selectedEvent.title.length
        ? "Update"
        : "Add"}
      Event
    </h5>
  );

  return (
    <Modal
      visible={isModalVisible}
      title={modalTitle}
      onCancel={() => {
        handleResetInputValues();
        handleCancel();
      }}
      className="hp-modal-p-24"
      footer={
        <Row justify="center">
          <Col span={12} className="hp-pr-4">
            <FooterCancelOrDelete />
          </Col>

          <Col span={12} className="hp-pl-4">
            <FooterAddOrUpdate />
          </Col>
        </Row>
      }
      centered
      closeIcon={
        <RiCloseFill className="remix-icon text-color-black-100" size={24} />
      }
      width={416}
    >
      <Form
        layout="vertical"
        onSubmit={handleSubmit(() => {
          if (
            isObjEmpty(selectedEvent) ||
            (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)
          ) {
            handleAddEvent();
          } else {
            handleUpdateEvent();
          }
        })}
      >
        <Form.Item label="Event Title :">
          <Input
            id="title"
            name="title"
            style={{ width: "100%" }}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="From :">
          <Flatpickr
            required
            id="startDate"
            name="startDate"
            style={{ width: "100%" }}
            onChange={(date) => setStartPicker(date[0])}
            value={startPicker}
            options={{
              enableTime: allDay === false,
              dateFormat: "d M Y - H:i K",
              static: true,
            }}
          />
        </Form.Item>

        <Form.Item label="To :">
          <Flatpickr
            required
            id="endDate"
            name="endDate"
            style={{ width: "100%" }}
            onChange={(date) => setEndPicker(date[0])}
            value={endPicker}
            options={{
              enableTime: allDay === false,
              dateFormat: "d M Y - H:i K",
              static: true,
            }}
          />
        </Form.Item>

        <Form.Item label="Event :">
          <Select
            id="label"
            value={value}
            options={options}
            classNamePrefix="select"
            isClearable={false}
            onChange={(data) => setValue([data])}
            components={{
              Option: OptionComponent,
            }}
          />
        </Form.Item>

        <Form.Item label="Description :">
          <TextArea
            style={{ width: "100%" }}
            type="textarea"
            name="text"
            id="description"
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEventSidebar;
