let hide = () => {
  document.getElementById("box").style.display = "none";
};

document.getElementById("menu").onclick = function () {
  document.getElementById("box").style.display = "block";
};

document.getElementById("hide").onclick = function () {
  document.getElementById("box").style.display = "none";
};

document.getElementById("newId").onclick = function () {
  localStorage.setItem("clientId", generateId());
  window.location.reload();
};

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

const id = getUserClientId();
const shortMaxValue = 32767;
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

let updateController = (key, value) => {
  controller[key] = value;
};

const toShort = (value) => {
  return parseInt(value * shortMaxValue);
};

const createControllerInput = (controllerInput) => {
  return JSON.stringify({
    Id: id,
    Controller: controllerInput,
  });
};

var inputBooleanList = document.querySelectorAll(".inputBool");

const connectAndRun = (ip) => {
  let ws = new WebSocket(`ws://${ip}:8181/`);
  ws.onopen = function () {
    console.log("connected");
  };

  ws.onclose = function () {
    console.log("disconnected");
  };

  ws.onmessage = function (evt) {
    console.log(evt.data);
  };

  inputBooleanList.forEach((input) => {
    let key = input.dataset.key || null;
    input.onpointerdown = function () {
      updateController(key, true);

      let inputString = createControllerInput(controller);
      ws.send(inputString);
    };

    input.onpointerup = function () {
      updateController(key, false);

      let inputString = createControllerInput(controller);
      ws.send(inputString);
    };
  });

  //end

  var nippleLeft = document.getElementById("nipple1");
  var nippleRight = document.getElementById("nipple2");

  var options = {
    color: "red",
    mode: "static",
    position: { left: "50%", top: "50%" },
  };

  var manager1 = nipplejs.create({ ...options, zone: nippleLeft });
  manager1
    .on("end", function (evt, data) {
      updateController("axis_left_x", 0);
      updateController("axis_left_y", 0);
      ws.send(createControllerInput(controller));
    })
    .on("move", function (evt, data) {
      updateController("axis_left_x", toShort(data.vector.x));
      updateController("axis_left_y", toShort(data.vector.y));
      ws.send(createControllerInput(controller));
    });

  var manager2 = nipplejs.create({ ...options, zone: nippleRight });
  manager2
    .on("end", function (evt, data) {
      updateController("axis_right_x", 0);
      updateController("axis_right_y", 0);
      ws.send(createControllerInput(controller));
    })
    .on("move", function (evt, data) {
      updateController("axis_right_x", toShort(data.vector.x));
      updateController("axis_right_y", toShort(data.vector.y));
      ws.send(createControllerInput(controller));
    });
};

let ipInput = document.getElementById("ip");

document.getElementById("saveIp").onclick = function () {
  let ip = ipInput.value;
  localStorage.setItem("ip", ip);
  connectAndRun(ip);
  hide();
};

let ip = localStorage.getItem("ip");
if (ip) {
  ipInput.value = ip;
}
