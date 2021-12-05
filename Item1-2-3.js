let Item1 = document.getElementById("Item1");
let Item2 = document.getElementById("Item2");
let Item3 = document.getElementById("Item3");
let ctx1 = Item1.getContext("2d");
let ctx2 = Item2.getContext("2d");
let ctx3 = Item3.getContext("2d");
ctx1.font = "18px Times New Roman";
ctx2.font = "18px Times New Roman";
ctx3.font = "18px Times New Roman";
const RADIUS = 20;
const TOKEN_RADIUS = 5;
const SIDE = 40;

/***************************Helping Functions***************************/
//centerX is the x-coordinate of the figure's center, the same with centerY
function drawPlace(centerX, centerY, label, numTokens = 0, ctx) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.textAlign = "center";
  if (ctx === ctx1) {
    ctx.fillText(label, centerX, centerY - 1.2 * RADIUS);
  } else if (ctx === ctx2) {
    if (centerY <= 75) ctx.fillText(label, centerX, centerY - 1.2 * RADIUS);
    else ctx.fillText(label, centerX, centerY + 1.7 * RADIUS);
  } else if (ctx === ctx3) {
    ctx.fillText(label, centerX, centerY + 1.8 * RADIUS);
  }
  if (numTokens > 0) drawNhieuTokens(centerX, centerY, numTokens, ctx);
}

//Draw arrow from figure with center coordinate (x1, y1) to figure with center coordinate (x2, y2)
function drawArrow(centerX1, centerY1, centerX2, centerY2, ctx) {
  const HEAD_LENGTH = 10;
  const ARROW_ANGLE = Math.PI / 6;

  let fromX = centerX1 + RADIUS;
  let fromY = centerY1;
  let toX = centerX2 - RADIUS;
  let toY = centerY2;
  let angle = Math.atan2(toY - fromY, toX - fromX);

  //Draw line from one figure to another
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  //Draw head of arrow
  ctx.beginPath();
  ctx.moveTo(
    toX - HEAD_LENGTH * Math.cos(angle - ARROW_ANGLE),
    toY - HEAD_LENGTH * Math.sin(angle - ARROW_ANGLE)
  );
  ctx.lineTo(toX, toY);
  ctx.lineTo(
    toX - HEAD_LENGTH * Math.cos(angle + ARROW_ANGLE),
    toY - HEAD_LENGTH * Math.sin(angle + ARROW_ANGLE)
  );
  ctx.stroke();
}

function drawTransition(centerX, centerY, label, ctx) {
  ctx.beginPath();
  ctx.rect(centerX - SIDE / 2, centerY - SIDE / 2, SIDE, SIDE);
  ctx.stroke();
  ctx.textAlign = "center";
  if (ctx === ctx1) {
    ctx.fillText(label, centerX, centerY - (1.2 * SIDE) / 2);
  } else if (ctx === ctx2) {
    if (centerY <= 75) ctx.fillText(label, centerX, centerY - 1.2 * RADIUS);
    else ctx.fillText(label, centerX, centerY + 1.7 * RADIUS);
  } else if (ctx === ctx3) {
    if (label == "start") {
      ctx.fillText(label, centerX - SIDE * 0.6, centerY + 0.9 * SIDE);
    } else if (label == "change") {
      ctx.fillText(label, centerX + SIDE * 0.7, centerY + 0.9 * SIDE);
    } else {
      ctx.fillText(label, centerX, centerY + 0.9 * SIDE);
    }
  }
}

//Draw 1 token
function drawToken(centerX, centerY, ctx) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, TOKEN_RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.stroke();
}

function drawNhieuTokens(centerX, centerY, num, ctx) {
  //Clear the inside of this figure
  ctx.clearRect(centerX - SIDE / 3, centerY - SIDE / 3, SIDE / 1.5, SIDE / 1.5);
  //Draw tokens
  if (num === 1) {
    drawToken(centerX, centerY, ctx);
  } else if (num == 2) {
    drawToken(centerX - 1.5 * TOKEN_RADIUS, centerY, ctx);
    drawToken(centerX + 1.5 * TOKEN_RADIUS, centerY, ctx);
  } else if (num === 3) {
    drawToken(centerX, centerY - TOKEN_RADIUS, ctx);
    drawToken(centerX - 1.5 * TOKEN_RADIUS, centerY + TOKEN_RADIUS, ctx);
    drawToken(centerX + 1.5 * TOKEN_RADIUS, centerY + TOKEN_RADIUS, ctx);
  } else if (num === 4) {
    drawToken(centerX - 1.5 * TOKEN_RADIUS, centerY - 1.5 * TOKEN_RADIUS, ctx);
    drawToken(centerX - 1.5 * TOKEN_RADIUS, centerY + 1.5 * TOKEN_RADIUS, ctx);
    drawToken(centerX + 1.5 * TOKEN_RADIUS, centerY - 1.5 * TOKEN_RADIUS, ctx);
    drawToken(centerX + 1.5 * TOKEN_RADIUS, centerY + 1.5 * TOKEN_RADIUS, ctx);
  } else {
    ctx.textAlign = "center";
    ctx.fillText(num, centerX, centerY + 5);
  }
}

class Figure {
  constructor(type, centerX, centerY, numTokens = 0) {
    this.type = type;
    this.centerX = centerX;
    this.centerY = centerY;
    this.numTokens = numTokens;
    this.inputs = [];
    this.outputs = [];
  }
  addInput(newObject) {
    this.inputs.push(newObject);
  }
  addOutput(newObject) {
    this.outputs.push(newObject);
  }
}

/***************************Item 1***************************/
//Assign values for each object Item1 with initial marking m0 = {5.wait, 1.done}
const wait1 = new Figure("place", 100, 75, 5);
const inside1 = new Figure("place", 300, 75);
const done1 = new Figure("place", 500, 75, 1);
const start1 = new Figure("transition", 200, 75);
const change1 = new Figure("transition", 400, 75);

start1.addInput(wait1);
start1.addOutput(inside1);
change1.addInput(inside1);
change1.addOutput(done1);

drawItem1();

const btn1 = document.querySelector("#btn1");
//Set number of tokens on petri net when clicking button in Item 1
btn1.addEventListener("click", function (event) {
  let wait1Input = parseInt(document.getElementById("wait1").value);
  let inside1Input = parseInt(document.getElementById("inside1").value);
  let done1Input = parseInt(document.getElementById("done1").value);
  if (wait1Input >= 0 && inside1Input >= 0 && done1Input >= 0) {
    wait1.numTokens = wait1Input;
    inside1.numTokens = inside1Input;
    done1.numTokens = done1Input;
  } else {
    alert("Inputs of the program must be nonnegative!");
    return;
  }
  if (wait1Input > 10) {
    alert("The programs allows maximum input of 10 patients in place wait!");
    return;
  }
  drawItem1();
});

function drawItem1() {
  ctx1.clearRect(0, 0, Item1.width, Item1.height);
  drawPlace(wait1.centerX, wait1.centerY, "wait", wait1.numTokens, ctx1);
  drawPlace(
    inside1.centerX,
    inside1.centerY,
    "inside",
    inside1.numTokens,
    ctx1
  );
  drawPlace(done1.centerX, done1.centerY, "done", done1.numTokens, ctx1);

  drawTransition(start1.centerX, start1.centerY, "start", ctx1);
  drawTransition(change1.centerX, change1.centerY, "change", ctx1);

  drawArrow(wait1.centerX, wait1.centerY, start1.centerX, start1.centerY, ctx1);
  drawArrow(
    start1.centerX,
    start1.centerY,
    inside1.centerX,
    inside1.centerY,
    ctx1
  );
  drawArrow(
    inside1.centerX,
    inside1.centerY,
    change1.centerX,
    change1.centerY,
    ctx1
  );
  drawArrow(
    change1.centerX,
    change1.centerY,
    done1.centerX,
    done1.centerY,
    ctx1
  );
}

/***************************Item 2***************************/
//Assign values for each object Item2 with initial marking m0 = {1.free}
const free2 = new Figure("place", 100, 75, 1);
const busy2 = new Figure("place", 200, 175);
const docu2 = new Figure("place", 300, 75);
const start2 = new Figure("transition", 100, 175);
const change2 = new Figure("transition", 300, 175);
const end2 = new Figure("transition", 200, 75);

start2.addInput(free2);
start2.addOutput(busy2);
change2.addInput(busy2);
change2.addOutput(docu2);
end2.addInput(docu2);
end2.addOutput(free2);

drawItem2();

const btn2 = document.querySelector("#btn2");
//Set number of tokens on petri net when clicking button in Item 2
btn2.addEventListener("click", function (event) {
  let free2Input = parseInt(document.getElementById("free2").value);
  let busy2Input = parseInt(document.getElementById("busy2").value);
  let docu2Input = parseInt(document.getElementById("docu2").value);

  if (free2Input >= 0 && busy2Input >= 0 && docu2Input >= 0) {
    free2.numTokens = free2Input;
    busy2.numTokens = busy2Input;
    docu2.numTokens = docu2Input;
  } else {
    alert("Inputs of the program must be nonnegative!");
    return;
  }
  drawItem2();
});

function drawItem2() {
  ctx2.clearRect(0, 0, Item2.width, Item2.height);
  drawPlace(free2.centerX, free2.centerY, "free", free2.numTokens, ctx2);
  drawPlace(busy2.centerX, busy2.centerY, "busy", busy2.numTokens, ctx2);
  drawPlace(docu2.centerX, docu2.centerY, "docu", docu2.numTokens, ctx2);

  drawTransition(start2.centerX, start2.centerY, "start", ctx2);
  drawTransition(change2.centerX, change2.centerY, "change", ctx2);
  drawTransition(end2.centerX, end2.centerY, "end", ctx2);

  drawArrow(
    free2.centerX - RADIUS,
    free2.centerY + RADIUS,
    start2.centerX + RADIUS,
    start2.centerY - RADIUS,
    ctx2
  );
  drawArrow(start2.centerX, start2.centerY, busy2.centerX, busy2.centerY, ctx2);
  drawArrow(
    busy2.centerX,
    busy2.centerY,
    change2.centerX,
    change2.centerY,
    ctx2
  );
  drawArrow(
    change2.centerX - RADIUS,
    change2.centerY - RADIUS,
    docu2.centerX + RADIUS,
    docu2.centerY + RADIUS,
    ctx2
  );
  drawArrow(
    docu2.centerX - 2 * RADIUS,
    docu2.centerY,
    end2.centerX + 2 * RADIUS,
    end2.centerY,
    ctx2
  );
  drawArrow(
    end2.centerX - 2 * RADIUS,
    end2.centerY,
    free2.centerX + 2 * RADIUS,
    free2.centerY,
    ctx2
  );
}

/***************************Item 3***************************/
//Move petri net in canvas
var hor = 0;
var ver = 5;
//Assign values for each object Item3 with initial marking m0 = {4.wait, 1.free, 1.done}
const wait3 = new Figure("place", 100 + hor, 200 + ver, 4);
const start3 = new Figure("transition", 200 + hor, 200 + ver);
const free3 = new Figure("place", 200 + hor, 300 + ver, 1);
const busy3 = new Figure("place", 300 + hor, 100 + ver);
const inside3 = new Figure("place", 300 + hor, 200 + ver);
const end3 = new Figure("transition", 300 + hor, 300 + ver);
const change3 = new Figure("transition", 400 + hor, 200 + ver);
const docu3 = new Figure("place", 400 + hor, 300 + ver);
const done3 = new Figure("place", 500 + hor, 200 + ver, 1);
start3.addInput(wait3);
start3.addInput(free3);
start3.addOutput(busy3);
start3.addOutput(inside3);
change3.addInput(busy3);
change3.addInput(inside3);
change3.addOutput(done3);
change3.addOutput(docu3);
end3.addInput(docu3);
end3.addOutput(free3);

drawItem3();

const btn3 = document.querySelector("#btn3");
//Set number of tokens on petri net when clicking button in Item 3
btn3.addEventListener("click", function (event) {
  let wait3Input = parseInt(document.getElementById("wait3").value);
  let busy3Input = parseInt(document.getElementById("busy3").value);
  let done3Input = parseInt(document.getElementById("done3").value);
  let inside3Input = parseInt(document.getElementById("inside3").value);
  let free3Input = parseInt(document.getElementById("free3").value);
  let docu3Input = parseInt(document.getElementById("docu3").value);
  if (
    wait3Input >= 0 &&
    busy3Input >= 0 &&
    done3Input >= 0 &&
    inside3Input >= 0 &&
    free3Input >= 0 &&
    docu3Input >= 0
  ) {
    wait3.numTokens = wait3Input;
    busy3.numTokens = busy3Input;
    done3.numTokens = done3Input;
    inside3.numTokens = inside3Input;
    free3.numTokens = free3Input;
    docu3.numTokens = docu3Input;
  } else {
    alert("Inputs of the program must be nonnegative!");
    return;
  }
  if (wait3Input > 10) {
    alert("The programs allows maximum input of 10 patients in place wait!");
    return;
  }
  drawItem3();
});

function drawItem3() {
  ctx3.clearRect(0, 0, Item3.width, Item3.height);
  drawPlace(wait3.centerX, wait3.centerY, "wait", wait3.numTokens, ctx3);
  drawPlace(busy3.centerX, busy3.centerY, "busy", busy3.numTokens, ctx3);
  drawPlace(done3.centerX, done3.centerY, "done", done3.numTokens, ctx3);
  drawPlace(
    inside3.centerX,
    inside3.centerY,
    "inside",
    inside3.numTokens,
    ctx3
  );
  drawPlace(free3.centerX, free3.centerY, "free", free3.numTokens, ctx3);
  drawPlace(docu3.centerX, docu3.centerY, "docu", docu3.numTokens, ctx3);

  drawTransition(start3.centerX, start3.centerY, "start", ctx3);
  drawTransition(change3.centerX, change3.centerY, "change", ctx3);
  drawTransition(end3.centerX, end3.centerY, "end", ctx3);

  drawArrow(wait3.centerX, wait3.centerY, start3.centerX, start3.centerY, ctx3);
  drawArrow(
    start3.centerX - 20,
    start3.centerY - 20,
    busy3.centerX,
    busy3.centerY,
    ctx3
  );
  drawArrow(
    busy3.centerX,
    busy3.centerY,
    change3.centerX + 20,
    change3.centerY - 20,
    ctx3
  );
  drawArrow(
    change3.centerX,
    change3.centerY,
    done3.centerX,
    done3.centerY,
    ctx3
  );
  drawArrow(
    start3.centerX,
    start3.centerY,
    inside3.centerX,
    inside3.centerY,
    ctx3
  );
  drawArrow(
    inside3.centerX,
    inside3.centerY,
    change3.centerX,
    change3.centerY,
    ctx3
  );
  drawArrow(
    change3.centerX - 20,
    change3.centerY + 20,
    docu3.centerX + 20,
    docu3.centerY - 20,
    ctx3
  );
  drawArrow(
    docu3.centerX - 40,
    docu3.centerY,
    end3.centerX + 40,
    end3.centerY,
    ctx3
  );
  drawArrow(
    end3.centerX - 40,
    end3.centerY,
    free3.centerX + 40,
    free3.centerY,
    ctx3
  );
  drawArrow(
    free3.centerX - 20,
    free3.centerY - 20,
    start3.centerX + 20,
    start3.centerY + 20,
    ctx3
  );
}

let transitions1 = [start1, change1];
let transitions2 = [start2, change2, end2];
let transitions3 = [start3, change3, end3];

for (const item of [Item1, Item2, Item3]) {
  //Set ctx and transitions with each case
  let ctx = ctx1;
  let transitions = transitions1;
  if (item === Item2) {
    ctx = ctx2;
    transitions = transitions2;
  } else if (item === Item3) {
    ctx = ctx3;
    transitions = transitions3;
  }

  //Change cursor to pointer on transitions
  item.addEventListener("mousemove", function (event) {
    let x = event.offsetX;
    let y = event.offsetY;
    if (
      transitions.some(function (transition) {
        return (
          x > transition.centerX - SIDE / 2 &&
          x < transition.centerX + SIDE / 2 &&
          y > transition.centerY - SIDE / 2 &&
          y < transition.centerY + SIDE / 2
        );
      })
    )
      document.body.style.cursor = "pointer";
    else document.body.style.cursor = "default";
  });

  //Transitions fire when clicked on
  item.addEventListener("click", function (event) {
    //Mouse coordinates in canvas
    let x = event.offsetX;
    let y = event.offsetY;
    transitions.forEach(function (transition) {
      if (
        //Conditions of transition's coordinate
        x > transition.centerX - SIDE / 2 &&
        x < transition.centerX + SIDE / 2 &&
        y > transition.centerY - SIDE / 2 &&
        y < transition.centerY + SIDE / 2
      ) {
        if (
          //True if all transition's inputs have numTokens > 0
          transition.inputs.every(function (element) {
            return element.numTokens > 0;
          })
        ) {
          //When clicking on transition, its ouput increment and update number of tokens by drawNhieuTokens
          for (const output of transition.outputs) {
            {
              ++output.numTokens;
              drawNhieuTokens(
                output.centerX,
                output.centerY,
                output.numTokens,
                ctx
              );
            }
          }
          //When clicking on transition, its ouput decrement and update number of tokens by drawNhieuTokens
          for (const input of transition.inputs) {
            if (input.numTokens > 0) {
              --input.numTokens;
              drawNhieuTokens(
                input.centerX,
                input.centerY,
                input.numTokens,
                ctx
              );
              if (input.numTokens === 0)
                ctx.clearRect(
                  input.centerX - SIDE / 3,
                  input.centerY - SIDE / 3,
                  SIDE / 1.5,
                  SIDE / 1.5
                );
            }
          }
        }
      }
    });
  });
}
