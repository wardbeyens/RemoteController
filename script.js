var static = nipplejs.create({
  zone: document.getElementById("nipple1"),
  mode: "static",
  position: { left: "50%", top: "50%" },
  color: "red",
});

const generateId = () => Math.random().toString(36).substr(2, 18);

const getUserClientId = () => {
  let localStorageId = localStorage.getItem("clientId");
  if (localStorageId) {
    return localStorageId;
  } else {
    let newId = generateId();
    localStorage.setItem("clientId", newId);
    return newId;
  }
};

const convertToXandY = (force, radian) => {
  let f = force >= 1 ? 1 : force;
  const x = f * Math.cos(radian);
  const y = f * Math.sin(radian);
  return { x, y };
};

const run = async () => {
  const id = getUserClientId();
  let i = 0;

  console.log(id);
  let controller = {
    thumb_stick_left: false,
    thumb_stick_right: false,

    y: false,
    x: false,
    b: false,
    a: false,

    start: false,
    back: false,

    guide: false,

    shoulder_left: false,
    shoulder_right: false,

    // dpad
    dpad_up: false,
    dpad_right: false,
    dpad_down: false,
    dpad_left: false,

    // axis
    axis_left_x: 0,
    axis_left_y: 0,

    axis_right_x: 0,
    axis_right_y: 0,

    // triggers
    trigger_left: 0,
    trigger_right: 0,
  };

  const createControllerInput = (controllerInput) => {
    return JSON.stringify({
      Id: id,
      Controller: controllerInput,
    });
  };

  let ws = new WebSocket("ws://localhost:8181/");
  ws.onopen = function () {
    console.log("connected");
  };

  ws.onclose = function () {
    console.log("disconnected");
  };

  ws.onmessage = function (evt) {
    console.log(evt.data);
  };

  let a = document.getElementById("a");
  a.onmousedown = function () {
    i++;
    ws.send(
      createControllerInput({
        ...controller,
        a: true,
      })
    );
  };
  a.onpointerdown = function () {
    i++;
    ws.send(
      createControllerInput({
        ...controller,
        a: true,
      })
    );
  };
  a.onmouseup = function () {
    i++;
    ws.send(
      createControllerInput({
        ...controller,
        a: false,
      })
    );
  };
  a.onpointerup = function () {
    i++;
    ws.send(
      createControllerInput({
        ...controller,
        a: false,
      })
    );
  };

  let pad_number = document.getElementById("home");
  pad_number.onmousedown = function () {
    ws.close();
  };

  nipplejs
    .create({
      zone: document.querySelector(".joystick"),
      mode: "static",
      color: "red",
      position: {
        left: "50%",
        top: "50%",
      },
      multitouch: true,
    })
    // start end
    .on("end", function (evt, data) {
      // set joystick to default position
      //sendEventToServer('end');
      // prevEvent = evt.type;
      // dir:up plain:up dir:left plain:left dir:down plain:down dir:right plain:right || move
    })
    .on("move", function (evt, data) {
      console.log(data);
      console.log(convertToXandY(data.force, data.angle.radian));
      var event = null; // convertDegreeToEvent(data.angle.degree);
    })
    .on("pressure", function (evt, data) {
      console.log("pressure");
    });
};

run();
