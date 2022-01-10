var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];



var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  //check for empty input
  if (!taskNameInput || !taskTypeInput) {
      alert("you need to fill out the task form!");
  return false;
  };

  //package up data as an object
  
  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
        console.log(isEdit);

  
// has data attribute, so get task id and call function to complete edit process
if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };
  
    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function(taskDataObj) {
    // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";

  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);


  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks();

  taskIdCounter++;
    
};

    var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement ("div");
    actionContainerEl.className = "task-actions";

    //create edit button

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.classname = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
      
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
      }

    



    return actionContainerEl;

};

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;
  
    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
      var taskId = targetEl.getAttribute("data-task-id");
      editTask(taskId);
    } 
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
      var taskId = targetEl.getAttribute("data-task-id");
      deleteTask(taskId);
    }
  };


var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
var updatedTaskArr = [];

// loop through current tasks
for (var i = 0; i < tasks.length; i++) {
  // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
  if (tasks[i].id !== parseInt(taskId)) {
    updatedTaskArr.push(tasks[i]);
  }
}

// reassign tasks array to be the same as updatedTaskArr
tasks = updatedTaskArr;


}

var editTask = function(taskId) {
    
  
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type

    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    //loop through array and task boject with new content

    for (var i =0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;

        };
    };

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    formEl.setAttribute("data-task-id", taskId);


    document.querySelector("#save-task").textContent = "Save Task";

    
  };


  var completeEditTask = function(taskName, taskType, taskId) {
      // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
    }
  };

    

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
  };

  var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);
  
    // find task list item based on event.target's data-task-id attribute
    var taskId = event.target.getAttribute("data-task-id");
  
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  
    // convert value to lower case
    var statusValue = event.target.value.toLowerCase();
  
    if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
      tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
      tasksCompletedEl.appendChild(taskSelected);
    }

    for (var i = 0; i< tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    
  };

  var saveTasks = function() {

    localStorage.setItem("tasks", JSON.stringify(tasks));



  };

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);