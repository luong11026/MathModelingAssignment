//Get the textarea element by id to perform the output to the web
const xuat = document.querySelector("#xuat");
function ReachableMarking(initial, res, seq, initial_seq) {
  let start = false,
    change = false,
    end = false;
  if (initial[0] > 0 && initial[1] > 0) start = true;
  if (initial[2] > 0 && initial[3] > 0) change = true;
  if (initial[4] > 0) end = true;

  if (!start && !change && !end) {
    return;
  }

  //If start transition is enabled, create new reachable marking and
  //add "start" to firing sequence to indicate a transition fired
  if (start) {
    let start_vec = [];
    let start_seq = [].concat(initial_seq);
    start_seq.push("start");
    start_vec.push(initial[0] - 1);
    start_vec.push(initial[1] - 1);
    start_vec.push(initial[2] + 1);
    start_vec.push(initial[3] + 1);
    start_vec.push(initial[4]);
    start_vec.push(initial[5]);
    res.push(start_vec);
    seq.push(start_seq);
  }

  //If change transition is enabled, create new reachable marking and
  //add "change" to firing sequence to indicate a transition fired
  if (change) {
    let change_vec = [];
    let change_seq = [].concat(initial_seq);
    change_seq.push("change");
    change_vec.push(initial[0]);
    change_vec.push(initial[1]);
    change_vec.push(initial[2] - 1);
    change_vec.push(initial[3] - 1);
    change_vec.push(initial[4] + 1);
    change_vec.push(initial[5] + 1);
    res.push(change_vec);
    seq.push(change_seq);
  }

  //If end transition is enabled, create new reachable marking and
  //add "end" to firing sequence to indicate a transition fired
  if (end) {
    let end_vec = [];
    let end_seq = [].concat(initial_seq);
    end_seq.push("end");
    end_vec.push(initial[0]);
    end_vec.push(initial[1] + 1);
    end_vec.push(initial[2]);
    end_vec.push(initial[3]);
    end_vec.push(initial[4] - 1);
    end_vec.push(initial[5]);
    res.push(end_vec);
    seq.push(end_seq);
  }
}

//Check
function checkValid(initial) {
  let start = false,
    change = false,
    end = false;
  if (initial[0] > 0 && initial[1] > 0) start = true;
  if (initial[2] > 0 && initial[3] > 0) change = true;
  if (initial[4] > 0) end = true;

  if (!start && !change && !end) return false;
  return true;
}

const btn4 = document.getElementById("btn4");
const count = document.getElementById("count");

function execute() {
  //Set time at the moment and timeout to stop the program
  //if the computing process takes too long
  let timeBegin = Date.now();
  let timeOut = 5000;

  let s = "";
  let initial = [];
  let initial_seq = [];
  initial_seq.push("");

  //Get input of tokens in each place by users
  let wait4 = parseInt(document.getElementById("wait4").value);
  let free4 = parseInt(document.getElementById("free4").value);
  let busy4 = parseInt(document.getElementById("busy4").value);
  let inside4 = parseInt(document.getElementById("inside4").value);
  let docu4 = parseInt(document.getElementById("docu4").value);
  let done4 = parseInt(document.getElementById("done4").value);

  //Check if each input is negative or not
  if (
    !(
      wait4 >= 0 &&
      free4 >= 0 &&
      busy4 >= 0 &&
      inside4 >= 0 &&
      docu4 >= 0 &&
      done4 >= 0
    )
  ) {
    alert("Inputs of the program must be nonnegative!");
    return;
  }

  //Check valid number in place wait
  if (wait4 > 10) {
    alert("The programs allows maximum input of 10 patients in place wait!");
    return;
  }

  initial.push(wait4);
  initial.push(free4);
  initial.push(busy4);
  initial.push(inside4);
  initial.push(docu4);
  initial.push(done4);

  let res = []; //2d integer array
  let seq = []; //2d string array
  res.push(initial);
  seq.push(initial_seq);
  let start = 0;
  while (true) {
    let valid = false;
    let size = res.length;
    for (let i = start; i < size; i++) {
      //Check if the computing takes too long
      if (Date.now() >= timeBegin + timeOut) {
        alert("Taking too long to compute the problem! Try smaller inputs!");
        return;
      }
      if (checkValid(res[i])) {
        valid = true;
        break;
      }
    }
    if (!valid) break;
    for (let i = start; i < size; i++) {
      //Check if the computing takes too long
      if (Date.now() >= timeBegin + timeOut) {
        alert("Taking too long to compute the problem! Try smaller inputs!");
        return;
      }
      ReachableMarking(res[i], res, seq, seq[i]);
    }
    start = size;
  }
  for (let i = 0; i < res.length; i++) {
    //Check if the computing takes too long
    if (Date.now() >= timeBegin + timeOut) {
      alert("Taking too long to compute the problem! Try smaller inputs!");
      return;
    }
    s += "Firing Sequence: [";
    for (let t = 0; t < seq[i].length; t++) {
      s += seq[i][t] + " ";
      //Check if the computing takes too long
      if (Date.now() >= timeBegin + timeOut) {
        alert("Taking too long to compute the problem! Try smaller inputs!");
        return;
      }
    }
    s += "]\n";
    s += "[ ";
    s +=
      res[i][0] +
      ".wait" +
      ", " +
      res[i][1] +
      ".free" +
      ", " +
      res[i][2] +
      ".busy" +
      ", " +
      res[i][3] +
      ".inside" +
      ", " +
      res[i][4] +
      ".docu" +
      ", " +
      res[i][5] +
      ".done";

    s += " ]\n\n";
  }

  //Output number of firing sequences
  count.innerHTML = res.length;
  //Output all the firing sequences
  xuat.value = s;
}

//Click button Submit to call function execute
btn4.addEventListener("click", function (event) {
  execute();
});
