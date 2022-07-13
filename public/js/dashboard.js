const input = document.getElementById("content");
const time = document.getElementById("time");
const addBtn = document.getElementsByClassName("bx-plus-medical")[0];
const todo_table = document.querySelector("#todo-table");
const empty = document.getElementById("todo-empty");


/* Dashboard OnLoad */
window.onload = () => {
  const check = InitializeStorage();
  const done = check[0];
  const pending = check[1];

  if (pending.length == 0) {
    empty.innerHTML = "Nothing To Do ??";
    return;
  }
  todo_table.style.display = "block";

  renderTask(pending);
  
  for (let j = 0; j < pending.length; j++) {
    const time = done[j].time
    var userTimer = time.split(":");
    var countDownDate = new Date().setHours(userTimer[0], userTimer[1],userTimer[2]);
    StartMyCounter(countDownDate, j);
  }
};


/* Render the Task */
function renderTask(arr) {
  if (arr.length != 0) {
    for (var i = 0; i < arr.length; i++) {
      const tr = document.createElement("tr");
      for (let i = 0; i < 5; i++) {
        window["span_" + i] = document.createElement("span");
        window["td_" + i] = document.createElement("td");
      }
      span_1.innerHTML = i + 1;
      span_2.classList.add(`content_${i}_td`);
      span_2.innerHTML = arr[i].content;
      span_3.classList.add("timer" + i);
      span_3.innerHTML = arr[i].time;
      span_4.innerHTML = `<button id="delete${i}" class="delete bx bx-trash bx-sm" onClick="deleteTask(this.getAttribute('id'));"></button>`;

      td_1.appendChild(span_1);
      td_2.appendChild(span_2);
      td_3.appendChild(span_3);
      td_4.appendChild(span_4);

      tr.classList.add("tr" + i);
      tr.appendChild(td_1);
      tr.appendChild(td_2);
      tr.appendChild(td_3);
      tr.appendChild(td_4);

      todo_table.appendChild(tr);
    }
  }
}


/* Start Counter  */
function StartMyCounter(countDownDate, idx) {
  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownDate - now;

    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementsByClassName("timer" + idx)[0].innerHTML =
      hours + ":" + minutes + ": " + seconds;

    var pending = getLocalStorage("pending");
    pending[idx].time = hours + ":" + minutes + ":" + seconds;
    setLocalStorage("pending",pending);

    if (distance < 0) {
      clearInterval(x);
      const pending = getLocalStorage("pending");
      const done = getLocalStorage("done");
      data = done[idx];
      done.push(data);
      pending.splice(idx, 1);
      setLocalStorage("done",done)
      setLocalStorage("pending",pending)
      notifyUser(data, idx);
      location.reload();
    }
  }, 1000);
}


/* Sending Notifications */
function notifyUser(data, idx) {
  fetch("/notify", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json","authorization" : "Bearer " + localStorage.getItem("token")}})
  .then(res => {
  if(res.status == 200){
  const done = getLocalStorage("done");
  const removedData = done.splice(idx, 1);
  const finished = getLocalStorage("finished");
  finished.push(removedData[0]);
  setLocalStorage("done",done);
  setLocalStorage("finished",finished)
  }
  }).catch(err => console.log(err));
}


/* Deleting Task */
function deleteTask(className) {
  taskid = className.slice(-1);
  const pending = getLocalStorage("pending");
  const done = getLocalStorage("done");
  pending.splice(taskid, 1);
  done.splice(taskid, 1);
  setLocalStorage("done", done);
  setLocalStorage("pending", pending);
  location.reload();
}

function getValue() {
  const inputVal = input.value;
  const timeVal = time.value + ":00";

  if (inputVal.length < 3 && timeVal.length < 4) {
    alert("Enter Valid Content and Time");
    location.reload();
  } else {
    return [inputVal, timeVal];
  }
}


/* Add Task Btn Event */
addBtn.addEventListener("click", () => {
  const inputs = getValue();

  const data = {
    content: inputs[0],
    time: inputs[1],
  };

  fetch("/dashboard", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + localStorage.getItem("token"),
    },
  }).then((res) => {
    if (res.status == 200) {
      const pending = getLocalStorage("pending");
      pending.push(data);
      const done = getLocalStorage("done");
      done.push(data);
      setLocalStorage("done", done);
      setLocalStorage("pending", pending);
      location.reload();
    } else if (res.status == 401) {
      alert("Something Went Wrong");
      window.location.href = "/login";
    }
  });
});


/* Initialize the Local Storage */
function InitializeStorage() {
  var done, pending
  if (localStorage.getItem("done") === null) {
    done = [];
    setLocalStorage("done", done);
  } else {
    done = getLocalStorage("done");
  }

  if (localStorage.getItem("pending") === null) {
    pending = [];
    setLocalStorage("pending", pending);
  } else {
    pending = getLocalStorage("pending");
  }

  if (localStorage.getItem("finished") === null) {
    const finished = [];
    setLocalStorage("finished", finished);
  }
  return [done, pending];
}

function clearLocalStorage(){
  var cleartime = new Date().setHours(23,59,59);
  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = cleartime - now;

    // var hours = Math.floor(
    //   (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    // );
    // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    // var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      const done = [];
      const pending = [];
      const finsihed = [];
      setLocalStorage("done",done);
      setLocalStorage("pending",pending);
      setLocalStorage("finsihed",finsihed); 
    }
  }, 1000);
}

function getLocalStorage(name){
  return JSON.parse(localStorage.getItem(name));
}

function setLocalStorage(name,data){
  localStorage.setItem(name, JSON.stringify(data));
}

clearLocalStorage();