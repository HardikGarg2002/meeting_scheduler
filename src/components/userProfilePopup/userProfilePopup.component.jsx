import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./user-profile-popup.scss";
import moment from "moment-timezone";
import { BsInfoCircle } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import { MdLocalPhone, MdOutlineVideocam } from "react-icons/md";

// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import CustomTooltip from "../toolTips/tooltips.components";
// import { durationOptionList } from "../../pages/schedule/settings/settings.constant";
// import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import { useCalendarDays } from "../../hooks/useCalendarDays";

export const formatDateString = (dateString) => {
  const formattedDate = moment
    .utc(dateString.toLocaleString())
    .format("YYYY-MM-DD");

  return formattedDate;
};

const ScheduleCallPopup = ({
  userid,
  firstname,
  lastname,
  email,
  profile_picture,
  popupvisible,
  sendDataToParentSchedule,
  callScheduled,
  requestFromMyConnection,
  senderId,
  senderTimeZone,
  displayRequestCall = true,
  displayClosebtn = true,
  ...props
}) => {
  //   const senderuserId = useSelector((state) => state.user.userId);
  //   const token = useSelector((state) => state.user.token);
  //   const userfirstname = useSelector((state) => state.user.firstName);
  //   const userlastname = useSelector((state) => state.user.lastName);
  //   const useremail = useSelector((state) => state.user.email);
  //   const userprofile = useSelector((state) => state.user.profile_picture);
  //   const headline = useSelector((state) => state.user.headline);
  //   const industry = useSelector((state) => state.user.industry);
  //   const interested_in = useSelector((state) => state.user.interested_in);
  //   const country = useSelector((state) => state.user.country);
  //   const city = useSelector((state) => state.user.city);
  //   const state = useSelector((state) => state.user.state);
  //   const organization = useSelector((state) => state.user.organization);
  //   const university = useSelector((state) => state.user.university);
  //   const classification = useSelector((state) => state.user.classification);
  const scheduleSettings = {
    timeZone: {
      value: "US/Central",
    },
  }; // Current login user ScheduleSettings

  const [userProfile, setUserProfile] = useState(null);
  const [dateState, setDateState] = useState(moment());
  const [timeState, setTimeState] = useState();
  const [requestTrigger, setRequestTrigger] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:15 AM");
  const [communicationType, setCommunicationType] = useState("phone");
  const [durationOptions, setDurationOption] = useState([]);
  const [durationState, setDurationState] = useState(15);
  const [inpersonLocationValue, setInpersonLocationValue] = useState(null);
  const [userSelectedDays, setUserSelectedDays] = useState([]);

  // const [availabilityHour, setAvailabilityHour] = useState([]);
  const [dynamicDropdownOptions, setDynamicDropdownOptions] = useState([]);
  const [originalDynamicDropdownOptions, setOriginalDynamicDropdownOptions] =
    useState([]);
  const [startTimeDynamicOption, setStartTimeDynamicOption] = useState([]);
  const [originalStartTimeOptionList, setOriginalStartTimeOptionList] =
    useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [profileUserAvailableDays, setProfileUserAvailableDays] = useState([]);

  useEffect(() => {
    if (props?.scheduleSettings) {
      if (durationState === "30") {
        const newOptions = [...originalDynamicDropdownOptions];
        const lastItem = newOptions.splice(-1);
        setDynamicDropdownOptions(newOptions);
        if (startTime === lastItem[0]?.key) {
          setStartTime(newOptions[newOptions.length - 1]?.key);
          calculateEndTime(
            newOptions[newOptions.length - 1]?.key,
            durationState
          );
        }
      } else if (durationState === "1") {
        const newOptions = [...originalDynamicDropdownOptions];
        const lastItems = newOptions.splice(-3);
        setDynamicDropdownOptions(newOptions);
        const itemExist = lastItems.find((i) => i?.key === startTime);
        if (itemExist) {
          setStartTime(newOptions[newOptions.length - 1]?.key);
          calculateEndTime(
            newOptions[newOptions.length - 1]?.key,
            durationState
          );
        }
      } else {
        setDynamicDropdownOptions(originalDynamicDropdownOptions);
      }
    } else if (!props?.scheduleSettings) {
      if (durationState === "30") {
        const startTimedropdowns = JSON.parse(
          JSON.stringify(originalStartTimeOptionList)
        );
        const uniqueSet = new Set(
          startTimedropdowns
            .filter((option) => formatDateString(dateState) === option.date)
            .map((item) => JSON.stringify(item))
        );
        const uniqueList = Array.from(uniqueSet, (item) => JSON.parse(item));

        const itemFoundIndex = uniqueList.findLastIndex(
          (i) => i.time.split(" ")[0].split(":")[1] === "30"
        );

        if (
          parseFloat(startTime.replace(":", ".")) >
          parseFloat(uniqueList[uniqueList.length - 1]?.time.replace(":", "."))
        ) {
          setStartTime(uniqueList[itemFoundIndex]?.time);
          calculateEndTime(uniqueList[itemFoundIndex]?.time, durationState);
        }
      } else if (durationState === "1") {
        const startTimedropdowns = JSON.parse(
          JSON.stringify(originalStartTimeOptionList)
        );
        const uniqueSet = new Set(
          startTimedropdowns
            .filter((option) => formatDateString(dateState) === option.date)
            .map((item) => JSON.stringify(item))
        );
        const uniqueList = Array.from(uniqueSet, (item) => JSON.parse(item));

        const itemFoundIndex = uniqueList.findLastIndex(
          (i) => i.time.split(" ")[0].split(":")[1] === "00"
        );

        uniqueList.splice(itemFoundIndex + 1, uniqueList.length);

        console.log(
          itemFoundIndex,
          uniqueList[itemFoundIndex]?.time,
          uniqueList,
          startTime
        );

        setStartTimeDynamicOption(uniqueList);
        if (
          parseFloat(startTime.replace(":", ".")) >
          parseFloat(uniqueList[uniqueList.length - 1]?.time.replace(":", "."))
        ) {
          setStartTime(uniqueList[uniqueList.length - 1]?.time);
          calculateEndTime(
            uniqueList[uniqueList.length - 1]?.time,
            durationState
          );
        }
      } else {
        const startTime = JSON.parse(
          JSON.stringify(originalStartTimeOptionList)
        );
        const uniqueSet = new Set(
          startTime
            .filter((option) => formatDateString(dateState) === option.date)
            .map((item) => JSON.stringify(item))
        );
        const uniqueList = Array.from(uniqueSet, (item) => JSON.parse(item));
        setStartTimeDynamicOption(uniqueList);
      }
    }
  }, [durationState]);

  useEffect(() => {
    setDurationOption(props?.durationOptions);
  }, [props?.durationOptions]);

  const availableDays = (availableHour) => {
    const selectedDays = new Set(
      availableHour.map((i) => parseInt(i.selecteDay))
    );
    const days = Array.from(selectedDays).sort();
    return days;
  };

  useEffect(() => {
    const days = availableDays(props?.availabilityHour);
    setUserSelectedDays(days);
  }, [props?.availabilityHour]);

  const calculateEndTime = (starttime, duration) => {
    var formatted = moment(starttime, ["h:mm A"]).format("hh:mm a");
    if (+duration === 1) {
      setEndTime(
        moment(formatted, "hh:mm:ss A").add(duration, "hour").format("hh:mm A")
      );
    } else {
      setEndTime(
        moment(formatted, "hh:mm:ss A")
          .add(duration, "minute")
          .format("hh:mm A")
      );
    }
  };

  const sendRequest = () => {};

  const generateTimeOptions = () => {
    const timeOptions = [];

    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = (hour % 12 || 12).toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const ampm = hour < 12 ? "AM" : "PM";
        const time = `${formattedHour}:${formattedMinute} ${ampm}`;
        // const isDisabled =
        //   hour < currentHour ||
        //   (hour === currentHour && minute < currentMinute + 15);
        timeOptions.push(
          <option key={time} value={time} disabled={false}>
            {time}
          </option>
        );
      }
    }

    return timeOptions;
  };

  const durationOptionUI = () => {
    return (
      <div className="form-row input-group m-0">
        {durationOptions?.map((item, index) => (
          <div
            key={index}
            className={`form-group mb-0 p-0 col-md-${Math.floor(
              12 / durationOptions.length
            )} ${
              index === 0
                ? "input-group-prepend"
                : durationOptions.length === index
                ? "input-group-append"
                : ""
            }`}
          >
            <label
              className={`form-check-label btn btn-outline-secondary w-100 d-flex align-items-center justify-content-between rounded-0 ${
                +durationState === +item?.value ? "active" : ""
              }`}
              htmlFor={`radio${item?.value}min`}
            >
              {parseInt(item?.value) !== 1
                ? `${item?.value} min`
                : `${item?.value} hour`}
              <input
                type="radio"
                name="duration"
                id={`radio${item?.value}min`}
                value={item?.value}
                onChange={(e) => {
                  setDurationState(e.target.value);
                  calculateEndTime(startTime, e.target.value);
                }}
                checked={+durationState === +item?.value ? true : false}
              />
            </label>
          </div>
        ))}
      </div>
    );
  };

  const communicationTypeUI = () => {
    const icons = (type) => {
      switch (type) {
        case "phone":
          return <MdLocalPhone size={18} className="mr-2" />;
        case "video":
          return <MdOutlineVideocam size={18} className="mr-2" />;
        case "in-person":
          // return <MdOutlinePersonPinCircle size={20} className="mr-2" />;
          return null;
        default:
          return null;
      }
    };

    return props?.communicationOptions?.length
      ? props?.communicationOptions?.map((item, index) => (
          <div
            className={`form-group mb-0 p-0 ${
              index === 0
                ? "input-group-prepend"
                : index === props?.communicationOptions.length - 1
                ? "input-group-append"
                : "input-group"
            } col-6 col-md-${Math.floor(
              12 / props?.communicationOptions.length
            )}`}
            key={item.value}
          >
            {item.value === "in-person" && !requestFromMyConnection ? (
              <CustomTooltip
                title="In-Person Only For Connections"
                className="btn p-0 position-absolute mt-n2"
                style={{
                  right: -5,
                  zIndex: 3,
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                }}
              >
                <BsInfoCircle size={14} />
              </CustomTooltip>
            ) : null}
            <label
              className={`form-check-label btn w-100 d-flex align-items-center justify-content-center rounded-0 ${
                communicationType === item.value ? "active" : ""
              } ${
                item.value === "in-person" && !requestFromMyConnection
                  ? "disabled"
                  : ""
              }`}
              htmlFor={`communication${item.value}`}
            >
              {icons(item.value)}
              {item.value}
              <input
                type="radio"
                name="communicationtype"
                id={`communication${item.value}`}
                className="sr-only"
                value={item.value}
                disabled={
                  item.value === "in-person" && !requestFromMyConnection
                    ? true
                    : false
                }
                onChange={() => {
                  console.log(item.value);
                  setCommunicationType(item.value);
                }}
                checked={communicationType === item.value ? true : false}
              />
            </label>
          </div>
        ))
      : null;
  };

  const handleChangeInpersonLocation = (e) => {
    let inpersonValue = e.target.value;
    if (inpersonValue) setInpersonLocationValue(inpersonValue);
    else setInpersonLocationValue(null);
  };

  const startTimeOptionUI = () => {
    return (
      <select
        name="start_time"
        id="starttime"
        required
        value={startTime}
        className="form-control"
        onChange={(e) => {
          setStartTime(e.target.value);
          calculateEndTime(e.target.value, durationState);
        }}
      >
        {generateTimeOptions()}
      </select>
    );
  };

  const getStartTimeDropdownOption = (date) => {
    const day = moment.tz(date, scheduleSettings?.timeZone?.value).day();

    // find value from object by day
    const itemFound = props?.availabilityHour
      .filter((i) => parseInt(i.selecteDay) === day)
      .sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime));

    if (itemFound?.length) {
      let timeOptions = [];

      itemFound.forEach((day) => {
        // Convert startTime and endTime to hours
        const startHour = parseInt(day.startTime.split(":")[0]);
        const endMinute = parseInt(day.endTime.split(":")[1]) || 0;
        const endHour = endMinute
          ? parseInt(day.endTime.split(":")[0]) + 1
          : parseInt(day.endTime.split(":")[0]);

        if (startHour > endHour) {
          // Loop from startTime to midnight
          for (let hour = startHour; hour < 24; hour++) {
            // Set the initial minute based on the start time
            let startMinute = 0;
            if (hour === startHour) {
              startMinute = parseInt(day.startTime.split(":")[1]);
            }

            for (let minute = startMinute; minute < 60; minute += 15) {
              const formattedHour = (hour % 12 || 12)
                .toString()
                .padStart(2, "0");
              const formattedMinute = minute.toString().padStart(2, "0");
              const ampm = hour < 12 ? "AM" : "PM";
              const time = `${formattedHour}:${formattedMinute} ${ampm}`;

              timeOptions.push(
                <option key={time} value={time} disabled={false}>
                  {time}
                </option>
              );
            }
          }

          // Loop from midnight to endTime
          for (let hour = 0; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
              const formattedHour = (hour % 12 || 12)
                .toString()
                .padStart(2, "0");
              const formattedMinute = minute.toString().padStart(2, "0");
              const ampm = hour < 12 ? "AM" : "PM";
              const time = `${formattedHour}:${formattedMinute} ${ampm}`;

              timeOptions.push(
                <option key={time} value={time} disabled={false}>
                  {time}
                </option>
              );

              if (
                parseInt(day.endTime.split(":")[0]) === hour &&
                endMinute === minute
              ) {
                break;
              }
            }
          }
        }

        if (startHour < endHour) {
          for (let hour = startHour; hour < endHour; hour++) {
            // Set the initial minute based on the start time
            let startMinute = 0;
            if (hour === startHour) {
              startMinute = parseInt(day.startTime.split(":")[1]);
            }

            for (let minute = startMinute; minute < 60; minute += 15) {
              const formattedHour = (hour % 12 || 12)
                .toString()
                .padStart(2, "0");
              const formattedMinute = minute.toString().padStart(2, "0");
              const ampm = hour < 12 ? "AM" : "PM";
              const time = `${formattedHour}:${formattedMinute} ${ampm}`;

              timeOptions.push(
                <option key={time} value={time} disabled={false}>
                  {time}
                </option>
              );

              if (
                parseInt(day.endTime.split(":")[0]) === hour &&
                endMinute === minute
              ) {
                break;
              }
            }
          }
        }
      });
      setDynamicDropdownOptions(timeOptions);
      setOriginalDynamicDropdownOptions(timeOptions);

      setStartTime(itemFound[0]?.startTime);
      calculateEndTime(itemFound[0]?.startTime, durationState);
    }
  };

  const handleClickDay = (value) => {
    const selectedDate = moment
      .tz(value, scheduleSettings?.timeZone?.value)
      .format("YYYY-MM-DDTHH:mm:ss");

    setDateState(selectedDate);
    // setDateState(moment(value).toISOString());
    if (props?.scheduleSettings) {
      getStartTimeDropdownOption(value);
    } else {
      const startTime = JSON.parse(JSON.stringify(originalStartTimeOptionList));
      const uniqueSet = new Set(
        startTime
          .filter((option) => formatDateString(selectedDate) === option.date)
          .map((item) => JSON.stringify(item))
      );
      const uniqueList = Array.from(uniqueSet, (item) => JSON.parse(item));
      if (uniqueList?.length) {
        setStartTimeDynamicOption(uniqueList);
        setStartTime(uniqueList[0]?.time);
        calculateEndTime(uniqueList[0]?.time, durationState);
      }
    }
  };

  return (
    <React.Fragment>
      <div className={`user_popup_container ${props.className}`}>
        <div className="container-fluid">
          <div className="row position-relative">
            <div className="col-12">
              <div className="user_popup">
                {requestTrigger && <div id="overlay_screen"></div>}
                <div className="row mx-0">
                  <div className="col-12 col-lg-6 py-4" id="calender_panel">
                    <div className="text-center">
                      {profile_picture ? (
                        <div
                          className="user_popup_thumbnail_circle"
                          style={{
                            backgroundImage: `url(${profile_picture})`,
                          }}
                        ></div>
                      ) : (
                        <div className="user_popup_thumbnail_circle">
                          <img src="https://avatar.iran.liara.run/public/boy?username=Ash" />
                        </div>
                      )}

                      <h3 className="user_popup_name">
                        {firstname && lastname
                          ? `Meet with ${firstname} ${lastname}`
                          : ""}
                      </h3>
                    </div>
                    <div className="px-3 mt-3">
                      <Calendar
                        className="schedule_calendar"
                        value={dateState}
                        minDate={
                          availableDates?.length
                            ? moment(availableDates[0]).toDate()
                            : moment
                                .tz(moment(), scheduleSettings?.timeZone?.value)
                                .toDate()
                        }
                        showNeighboringMonth={false}
                        view="month"
                        locale="en"
                        next2Label={null}
                        prev2Label={null}
                        disabled
                        tileDisabled={({ date }) => {
                          if (userSelectedDays) {
                            return !userSelectedDays?.includes(date.getDay());
                          }
                        }}
                        onClickDay={handleClickDay}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 py-4" id="input_panel">
                    <div className="row">
                      {displayClosebtn ? (
                        requestTrigger ? (
                          <div
                            className="close_popup disabled"
                            aria-disabled="true"
                          >
                            <IoMdCloseCircle size="2em" />
                          </div>
                        ) : (
                          <div
                            className="close_popup"
                            onClick={() =>
                              sendDataToParentSchedule(!popupvisible)
                            }
                          >
                            <IoMdCloseCircle size="2em" />
                          </div>
                        )
                      ) : null}
                      <div className="col-12 pb-2 pb-md-4 pl-4">
                        <div className="mb-4">
                          <h4 className="schedule-title">
                            Current selected date is
                          </h4>
                          <p>{moment(dateState).format("MMMM Do YYYY")}</p>
                        </div>

                        <div className="mb-4">
                          <h4 className="schedule-title">Select Duration:</h4>
                          {durationOptionUI()}
                        </div>

                        <div className="mb-4">
                          <h4 className="schedule-title mb-0">
                            Schedule Time:
                          </h4>
                          <span
                            style={{
                              fontSize: 14,
                              marginBottom: 10,
                              display: "inline-block",
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            className="btn-link"
                            onClick={() =>
                              sendDataToParentSchedule(!popupvisible)
                            }
                          >
                            View your schedule settings.
                          </span>

                          <div className="form-row">
                            <div className="col-12 col-md-6">
                              <label htmlFor="starttime" className="mb-0">
                                <small>Start Time *</small>
                              </label>
                              {startTimeOptionUI()}
                            </div>

                            <div className="col-12 col-md-6">
                              <label htmlFor="endtime" className="mb-0">
                                <small>End Time *</small>
                              </label>
                              <div
                                style={{
                                  padding: "5px 10px",
                                  border: "1px solid #cccccc",
                                  borderRadius: "5px",
                                  color: "#495057",
                                }}
                              >
                                {endTime}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="form-row input-group m-0 communication_type">
                            {communicationTypeUI()}
                          </div>
                          {communicationType === "in-person" ? (
                            <div className="form-group mt-2 mb-0">
                              <label htmlFor="locationdetail_input">
                                Enter Location
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="locationdetail_input"
                                onChange={handleChangeInpersonLocation}
                              />
                            </div>
                          ) : null}
                        </div>
                        {displayRequestCall ? (
                          requestTrigger ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary btn-block rounded-0 btn-request-call"
                                disabled
                              >
                                Request A Call
                              </button>
                              <p className="mb-0 mt-2 text-center d-block">
                                Scheduling call, please wait...
                              </p>
                            </>
                          ) : (props?.communicationOptions?.length &&
                              props?.communicationOptions[0]?.value ===
                                "in-person" &&
                              !requestFromMyConnection) ||
                            !userSelectedDays?.includes(
                              new Date(dateState).getDay()
                            ) ? (
                            <>
                              <button
                                onClick={() => {}}
                                type="button"
                                className="btn btn-primary btn-block rounded-0 btn-request-call"
                                disabled={true}
                              >
                                Request A Call
                              </button>
                              {!userSelectedDays?.includes(
                                new Date(dateState).getDay()
                              ) ? (
                                <p
                                  className="text-danger text-center mt-2 mb-0"
                                  style={{ fontSize: "small" }}
                                >
                                  Please Select Available Dates.
                                </p>
                              ) : null}
                            </>
                          ) : (
                            <button
                              onClick={sendRequest}
                              type="button"
                              className="btn btn-primary btn-block rounded-0 btn-request-call"
                            >
                              Request A Call
                            </button>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ScheduleCallPopup;
