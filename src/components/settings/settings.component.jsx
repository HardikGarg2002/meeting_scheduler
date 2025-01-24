import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Select from "react-select";

import moment from "moment";
import "moment-timezone";
// import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import "./settings.style.scss";

// import ScheduleCallPopup from "../../../components/user-profile-popup/schedule-call-popup";

import {
  communicationTypeOptionList,
  defaultAvailabilityWindow,
  durationOptionList,
  minimumNoticeTimeOptions,
  timezoneOptionList,
  usTimeZone,
  user1,
  user2,
} from "./settings.constant";
import ScheduleCallPopup from "../userProfilePopup/userProfilePopup.component";

const generateTimeOptions = (minuteIncrement = 15) => {
  const timeOptions = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += minuteIncrement) {
      // const formattedHour = (hour % 12 || 12).toString().padStart(2, "0");
      const formattedHour = (hour % 12 || 12).toString();
      const formattedMinute = minute.toString().padStart(2, "0");
      const ampm = hour < 12 ? "AM" : "PM";
      const time_12_hours = `${formattedHour}:${formattedMinute} ${ampm}`;
      const time_24_hours = `${hour}:${formattedMinute}`;
      // const isDisabled =
      //   hour < currentHour ||
      //   (hour === currentHour && minute < currentMinute + 15);
      timeOptions.push(
        <option key={time_12_hours} value={time_24_hours} disabled={false}>
          {time_12_hours}
        </option>
      );
    }
  }

  return timeOptions;
};

function Settings() {
  const uuId = uuidv4();
  const [userInfo, setUserInfo] = useState(user1);
  const [otherUserInfo, setOtherUserInfo] = useState(user2);
  const [scheduleCallPopupVisible, setScheduleCallPopupVisible] =
    useState(false);

  const [durations, setDurations] = useState([]);
  const [communicationType, setCommunicationType] = useState([]);
  const [timeZone, setTimeZone] = useState({});
  const [currentTime, setCurrentTime] = useState(""); // display based on timeZone
  const [minimumNoticeTime, setMinimumNoticeTime] = useState({});
  const [availabilityHour, setAvailabilityHour] = useState([]);
  const [availabilityAddRowError, setAvailabilityAddRowError] = useState(null);
  const [formEdited, setFormEdited] = useState(false);

  useEffect(() => {
    initialData(userInfo);
    setOtherUserInfo(userInfo.id === 1 ? user2 : user1);
  }, [userInfo]);

  const initialData = (user) => {
    setDurations(user.durations);
    setCommunicationType(user.communicationType);
    setAvailabilityHour(user.availabilityHour);
    setMinimumNoticeTime(minimumNoticeTimeOptions[0]);
    setTimeZone(user.timeZone);
    setCurrentTime(
      moment().tz(user.timeZone?.value).format("MM-DD-YYYY HH:mm:ss")
    );
  };

  const handleDuration = (duration) => {
    const sorted = duration.sort(
      (a, b) => parseInt(a.value) - parseInt(b.value)
    );
    if (sorted[0].value === 1) {
      sorted.push(sorted.shift());
    }
    setDurations(sorted);
    setFormEdited(true);
  };

  const handleCommunicationType = (type) => {
    if (type.length > 1) {
      const existingType = type.map((i) => {
        if (i.value === "phone") {
          return {
            ...i,
            index: 0,
          };
        }
        if (i.value === "video") {
          return {
            ...i,
            index: 1,
          };
        }

        if (i.value === "in-person") {
          return {
            ...i,
            index: 2,
          };
        }
      });
      const sortedType = existingType.sort((a, b) => {
        return a.index - b.index;
      });
      setCommunicationType(sortedType);
    } else {
      setCommunicationType(type);
    }
    setFormEdited(true);
  };

  const handleTimeZone = (timezone) => {
    setTimeZone(timezone);
    setCurrentTime(moment().tz(timezone.value).format("MM-DD-YYYY HH:mm:ss"));
    setFormEdited(true);
  };

  const handleAddNewHours = () => {
    const availabilityNewRow = {
      id: uuId,
      selecteDay: "0",
      startTime: "9:00",
      endTime: "17:00",
    };

    setAvailabilityHour((prev) => {
      return [...prev, availabilityNewRow];
    });
    setAvailabilityAddRowError(null);
    setFormEdited(true);
  };

  const handleRemoveAvailabilityRow = (id) => {
    const updatedAvailabilityRows = availabilityHour.filter(
      (item) => item.id !== id
    );
    setAvailabilityHour(updatedAvailabilityRows);
    setAvailabilityAddRowError(null);
    setFormEdited(true);
  };

  const handleChangeUpdateAvailabilityRow = (e, id) => {
    e.preventDefault();
    const rowsList = JSON.parse(JSON.stringify(availabilityHour));
    const findRow = rowsList.find((item) => (item.id === id ? item : null));
    if (findRow) {
      findRow[e.target.name] = e.target.value;
    }

    setAvailabilityHour(rowsList);
    setFormEdited(true);
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    const scheduleSettingsData = {
      durations: durations,
      communications: communicationType,
      timeZone: timeZone,
      availabilitywindow: availabilityHour,
      minimumNoticeTime: minimumNoticeTime,
    };

    console.log({ scheduleSettingsData });

    // const httpbody = {
    //   user_id: userInfo.userId,
    //   scheduleSettings: JSON.stringify(scheduleSettingsData),
    // };

    // const configheader = {
    //   "Content-Type": "application/json",
    //   Authorization: `Barer ${userInfo.token}`,
    // };

    // axios
    //   .post(`${clientConfig.siteUrl}wl/v1/schedule-settings-update`, httpbody, {
    //     headers: configheader,
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       if (response?.data?.updated) {
    //         console.log(
    //           response?.data?.message || "Settings Saved Successfully"
    //         );
    //       } else {
    //         console.log(response?.data?.message);
    //       }
    //     }
    //     setFormEdited(false);
    //   })
    //   .catch((error) => {
    //     console.assert(
    //       "Something went wrong, please try again after some time"
    //     );
    //     console.assert(error);
    //     setFormEdited(false);
    //   });
  };

  const handleSettingsReset = (e) => {
    e.preventDefault();
    initialData();
    setFormEdited(false);
  };

  let renderAvailabilityUI = (
    <p className="text-danger small">Please add hours</p>
  );

  if (availabilityHour?.length) {
    renderAvailabilityUI = availabilityHour?.map((item) => (
      <div key={item.id} className="availability_window_row my-2">
        <select
          className="form-control px-1"
          name="selecteDay"
          value={item?.selecteDay}
          onChange={(e) => handleChangeUpdateAvailabilityRow(e, item.id)}
        >
          <option value="0">Sunday</option>
          <option value="1">Monday</option>
          <option value="2">Tuesday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
          <option value="6">Saturday</option>
        </select>

        <div className="d-flex d-sm-none px-1"></div>
        <div className="px-sm-2 d-none d-sm-flex">from</div>

        <select
          className="form-control px-1"
          value={item?.startTime}
          name="startTime"
          onChange={(e) => handleChangeUpdateAvailabilityRow(e, item.id)}
        >
          {generateTimeOptions(60)}
        </select>

        <div className="px-1 px-sm-2">to</div>

        <select
          className="form-control px-1"
          value={item?.endTime}
          name="endTime"
          onChange={(e) => handleChangeUpdateAvailabilityRow(e, item.id)}
        >
          {generateTimeOptions(60)}
        </select>

        <button
          className="btn pr-0 pt-0 pb-0 pl-1 pl-sm-3"
          onClick={() => handleRemoveAvailabilityRow(item.id)}
        >
          <RiDeleteBinLine size="1.3em" className="text-danger" />
        </button>
      </div>
    ));
  }

  const handleSwitchUser = () => {
    if (userInfo.id === 1) {
      setUserInfo(user2);
    } else {
      setUserInfo(user1);
    }
  };

  const handleScheduleCallPopup = () => {
    setScheduleCallPopupVisible(!scheduleCallPopupVisible);
  };

  return (
    <div className="container-fluid">
      <div className="container">
        <div className="schedule-settings-container py-4">
          <div className="row">
            <div className="col-6">
              <h1 className="title">Schedule Settings</h1>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center justify-content-end">
                <span className="btn-link" onClick={handleSwitchUser}>
                  Switch to Other User Settings
                </span>
                <img
                  src={userInfo.profile_picture}
                  className="rounded-circle ml-3"
                  width={50}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <form className="col-12 col-xl-5">
              <div className="row">
                <div className="col-12 col-md-12">
                  <div className="form-group">
                    <label htmlFor="scheduletitleinput">Duration options</label>
                    <Select
                      value={durations}
                      options={durationOptionList}
                      isMulti
                      onChange={handleDuration}
                      menuPlacement="auto"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-12">
                  <div className="form-group">
                    <label htmlFor="scheduletitleinput">
                      Communication type
                    </label>
                    <Select
                      value={communicationType}
                      options={communicationTypeOptionList}
                      isMulti
                      onChange={handleCommunicationType}
                      menuPlacement="auto"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="scheduletitleinput">
                  Your time zone{" "}
                  <span className="text-primary small font-weight-bold ml-2">
                    {currentTime ? `(${currentTime})` : null}
                  </span>
                </label>
                <Select
                  value={timeZone}
                  options={timezoneOptionList}
                  closeMenuOnSelect={true}
                  onChange={handleTimeZone}
                  menuPlacement="auto"
                />
              </div>

              <div className="form-group">
                <label htmlFor="scheduletitleinput">Availability window</label>

                {renderAvailabilityUI}
                {availabilityAddRowError ? (
                  <small className="text-danger mt-1">
                    {availabilityAddRowError}
                  </small>
                ) : null}
                <div className="d-block"></div>
                <button
                  type="button"
                  className="btn font-weight-bold text-primary p-0 mt-2"
                  style={{ fontSize: 14 }}
                  onClick={handleAddNewHours}
                >
                  + Add hours
                </button>
              </div>

              <div className="form-group mt-4">
                {formEdited ? (
                  <div className="row">
                    <div className="col-12">
                      <div className="d-block d-md-flex">
                        <button
                          type="button"
                          className="btn px-5  btn-primary"
                          onClick={handleSettingsSave}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn px-5 btn-outline-primary mx-md-3 my-2 my-md-0"
                          onClick={handleSettingsReset}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      <p className="mt-2">Save your recent changes.</p>
                    </div>
                  </div>
                ) : (
                  <div className="d-block d-md-flex">
                    <button
                      className="btn px-5 btn-primary btn-disabled"
                      disabled
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </form>

            <div className="col-12 col-xl-7">
              <ScheduleCallPopup
                userid={userInfo.id}
                firstname={userInfo.firstName}
                lastname={userInfo.lastName}
                profile_picture={userInfo.profile_picture}
                email={userInfo.email || userInfo.user_email}
                popupvisible={true}
                sendDataToParentSchedule={() => {}}
                callScheduled={() => {}}
                requestFromMyConnection={true}
                senderId={null}
                displayRequestCall={false}
                displayClosebtn={false}
                className="position-relative mx-n3 evenSizebox"
                durationOptions={durations}
                communicationOptions={communicationType}
                scheduleTimezone={timeZone?.value}
                availabilityHour={availabilityHour}
                scheduleSettings
              />

              <div className="d-flex align-items-center justify-content-end mt-5">
                <button
                  className="btn btn-lg btn-primary"
                  onClick={handleScheduleCallPopup}
                >
                  Schedule Call with User{" "}
                  {userInfo.id === user1.id ? user2.id : user1.id}
                  <img
                    src={
                      userInfo.id === user1.id
                        ? user2.profile_picture
                        : user1.profile_picture
                    }
                    className="rounded-circle ml-3"
                    width={40}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <h5>USER 1</h5>
            <pre>{JSON.stringify(user1, undefined, 2)}</pre>
          </div>
          <div className="col-6">
            <h5>USER 2</h5>
            <pre>{JSON.stringify(user2, undefined, 2)}</pre>
          </div>
        </div>
      </div>

      <div
        style={{ display: scheduleCallPopupVisible ? "flex" : "none" }}
        className="user_popup_outerbox"
      >
        <div className="user_popup_backdrop"></div>
        <ScheduleCallPopup
          userid={otherUserInfo.id}
          firstname={otherUserInfo.first_name}
          lastname={otherUserInfo.last_name}
          profile_picture={otherUserInfo.profile_picture}
          email={otherUserInfo.email || otherUserInfo.user_email}
          popupvisible={scheduleCallPopupVisible}
          sendDataToParentSchedule={handleScheduleCallPopup}
          senderId={userInfo?.id}
          senderTimeZone={timeZone}
          durationOptions={otherUserInfo?.durations || durationOptionList}
          communicationOptions={
            otherUserInfo?.communicationsType || communicationTypeOptionList
          }
          scheduleTimezone={otherUserInfo?.timeZone?.value}
          availabilityHour={
            otherUserInfo?.availabilityHour || defaultAvailabilityWindow
          }
        />
      </div>
    </div>
  );
}

export default Settings;
