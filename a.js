nipplejs
  .create({
    zone: nipple1,
    mode: "semi",
    catchDistance: 150,
    color: "red",
    // position: {
    //   left: "50%",
    //   top: "50%",
    // },
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
  })
  .on("pressure", function (evt, data) {
    console.log("pressure");
  });
