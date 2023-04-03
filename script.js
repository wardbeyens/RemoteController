var nippleLeft = document.getElementById("nipple1");
var nippleRight = document.getElementById("nipple2");

var options = {
  color: "red",
  mode: "static",
  position: { left: "50%", top: "50%" },
};

var manager1 = nipplejs.create({ ...options, zone: nippleLeft });
var manager2 = nipplejs.create({ ...options, zone: nippleRight });

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
  newId();
  //window.location.reload();
};
let id = null;
const generateId = () => Math.random().toString(36).substr(2, 18);
const newId = () => {
  let newId = generateId();
  localStorage.setItem("clientId", newId);
  id = newId;
  return newId;
};

const getUserClientId = () => {
  let localStorageId = localStorage.getItem("clientId");

  if (localStorageId) {
    return localStorageId;
  } else {
    return newId();
  }
};

id = getUserClientId();

const shortMaxValue = 32767;
console.log(id);

var controller = {
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

var ws = null;

let updateController = (key, value) => {
  controller[key] = value;
  // console.table(controller);
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
var inputTriggerList = document.querySelectorAll(".inputTrigger");

const checkAndSend = () => {
  ws.readyState === 1 && ws.send(createControllerInput(controller));
};

const connectAndRun = (ip) => {
  ws = new WebSocket(`ws://${ip}:8181/`);
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
      checkAndSend();
    };

    input.onpointerup = function () {
      updateController(key, false);
      checkAndSend();
    };
  });

  inputTriggerList.forEach((input) => {
    let key = input.dataset.key || null;
    input.onpointerdown = function () {
      updateController(key, 255);

      checkAndSend();
    };

    input.onpointerup = function () {
      updateController(key, 0);
      checkAndSend();
    };
  });

  //end

  manager1
    .on("end", function (evt, data) {
      updateController("axis_left_x", 0);
      updateController("axis_left_y", 0);
      checkAndSend();
    })
    .on("move", function (evt, data) {
      updateController("axis_left_x", toShort(data.vector.x));
      updateController("axis_left_y", toShort(data.vector.y));
      checkAndSend();
    });

  manager2
    .on("end", function (evt, data) {
      updateController("axis_right_x", 0);
      updateController("axis_right_y", 0);
      checkAndSend();
    })
    .on("move", function (evt, data) {
      updateController("axis_right_x", toShort(data.vector.x));
      updateController("axis_right_y", toShort(data.vector.y));
      checkAndSend();
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

document.getElementById("disconnect").onclick = function () {
  if (ws) {
    let disconnectInput = {
      Id: id,
      State: "disconnect",
    };
    ws.send(JSON.stringify(disconnectInput));
    id = newId();
  }
};
