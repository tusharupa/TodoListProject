import { addDays, format , isEqual, isWithinInterval, parseISO} from "date-fns";
import {project, projectMaster} from "./project";
import { listenTaskClicks } from "./taskHandler";


function displayToday(){
    document.querySelector('.projectLabel').textContent="Tasks to be completed by Today !";
const content=document.querySelector('.task-content');
content.textContent="";
let today=Date.parse(format(new Date(), "yyyy-MM-dd"));
projectMaster.projectList.forEach(project => {
    project.taskList.forEach( task => {
        let date= Date.parse(task.date);
        if(isEqual(date,today))
        {
            addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
        }
        else
        return;
    });
});
projectMaster.defaultProject.forEach(task =>{
    let date = Date.parse(task.date);
    if(isEqual(date,today))
    {
        addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
    }
    else
    return;
});
}

function displayThisWeek(){
    document.querySelector('.projectLabel').textContent="Tasks to be completed by this Week!";
    const content=document.querySelector('.task-content');
content.textContent="";
projectMaster.projectList.forEach(project => {
    project.taskList.forEach(task => {
        let date = parseISO(task.date);
        if(checkNextWeek(date))
        addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
        else
        return;
    });
});
projectMaster.defaultProject.forEach(task => {
    let date = parseISO(task.date);
    if(checkNextWeek(date))
    addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
    else
    return;
});
}

function importantTasks(){
    document.querySelector('.projectLabel').textContent="Important Tasks!";
    const content=document.querySelector('.task-content');
content.textContent="";

projectMaster.projectList.forEach(project => {
    project.taskList.forEach((task,index) => {
        task.id=index;
        if(task.priority)
        addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
        else
        return;
    });
});
projectMaster.defaultProject.forEach((task,index) => {
    task.id = index;
    if(task.priority)
        addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
        else
        return;
});
}

function addTask(taskId,taskName,taskDate,taskProjectId,taskComplete,taskPriority)
{
    const content = document.querySelector('.task-content');
    if(taskProjectId == -1)
    {
        const div = document.createElement('div');
        div.classList.add('todoTask');
        div.setAttribute('data-task-index',taskId);
        div.setAttribute('data-task',taskName);
        const para = document.createElement('p');
        para.textContent= taskName;
        para.classList.add('taskText');

        const checkbox=document.createElement('span');
        checkbox.classList.add('checkbox');
        checkbox.classList.add('material-symbols-outlined');
        checkbox.textContent="Radio_Button_Unchecked";
       if(taskComplete)
      { checkbox.classList.add('checked');
      checkbox.textContent="Check_Circle";
      para.classList.add('linethrough');
    }

        
        const dateInput=document.createElement('div');
        dateInput.textContent=taskDate;
        dateInput.classList.add('taskDate');
        const delbtn = document.createElement('button');
        delbtn.classList.add('material-symbols-outlined');
    delbtn.textContent = "Delete";
        delbtn.classList.add('deleteTaskBtn');
        delbtn.dataset.taskID=taskId;

        const important=document.createElement('span');
        important.classList.add('important');
        important.classList.add('material-symbols-outlined');
        important.textContent="Star";
        if(taskPriority)
        important.classList.add('priority');

        const editTask = document.createElement('span');
        editTask.classList.add('material-symbols-outlined');
        editTask.classList.add('editTask');
        editTask.textContent="Edit_Square";

        
        div.append(checkbox);
        div.append(para);
        div.append(dateInput);
        div.append(important);
        div.append(editTask);
        div.append(delbtn);
        content.append(div);
    }
    else
    {
        const div = document.createElement('div');
    div.classList.add('todoTask');
    div.setAttribute('data-task-index',taskId);
    div.setAttribute('data-task',taskName);
    // element.id=index; 
    const para = document.createElement('p');
    para.textContent= taskName;
    para.classList.add('taskText');
    const checkbox=document.createElement('span');
       checkbox.classList.add('checkbox');
       checkbox.classList.add('material-symbols-outlined');
       checkbox.textContent="Radio_Button_Unchecked";
    if(taskComplete)
    {checkbox.classList.add('checked');
    checkbox.textContent="Check_Circle";
    para.classList.add('linethrough');
    }
   

    const dateInput=document.createElement('div');
        dateInput.textContent=taskDate;
        dateInput.classList.add('taskDate');
    const delbtn = document.createElement('button');
    delbtn.classList.add('material-symbols-outlined');
    delbtn.textContent = "Delete";
    delbtn.classList.add('deleteTaskBtn');
    delbtn.dataset.taskID=taskId;
    
    const important=document.createElement('span');
        important.classList.add('important');
        important.classList.add('material-symbols-outlined');
        important.textContent="Star";
        if(taskPriority)
        important.classList.add('priority');

        const editTask = document.createElement('span');
        editTask.classList.add('material-symbols-outlined');
        editTask.classList.add('editTask');
        editTask.textContent="Edit_Square";

        div.append(checkbox);
        div.append(para);
        div.append(dateInput);
        div.append(important);
        div.append(editTask);
        div.append(delbtn);
    content.append(div);
    };
}

const domEventListeners = () => {
    const todayTasks = document.querySelector('.today');
    todayTasks.addEventListener('click',()=>{
        displayToday();
        projects();}
        );

    const inbox = document.querySelector('.inbox');
    inbox.addEventListener('click',()=>{
        document.querySelector('.projectLabel').textContent="Tasks not under any Project!";
        const content=document.querySelector('.task-content');
content.textContent="";
      projectMaster.defaultProject.forEach(task => {
        addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
      })
      projects();
    });

    const thisWeek = document.querySelector('.week');
    thisWeek.addEventListener('click',()=> { displayThisWeek();
    projects();
});

    const importantTask=document.querySelector('.important');
    importantTask.addEventListener('click',()=>{
        importantTasks();
        projects();
    });
}

function checkNextWeek(taskDate){
    let nextWeekPlus1=addDays(new Date(),8);
    let today = new Date();
    return isWithinInterval(taskDate,{
        start: today,
        end: nextWeekPlus1
    });
}

function projects(){
    const projectArea=document.querySelector('.projects');
      projectArea.innerHTML="";
      projectMaster.read().forEach((project,index)=>{
          const div = document.createElement('div');
          div.classList.add('projectDiv');
          div.setAttribute('data-project',project.title);
          div.setAttribute('data-project-index',index);
          project.id = index;
          const para=document.createElement('p');
          para.textContent=project.title;
          para.classList.add('projectText');
  
          const delbtn=document.createElement('button');
          delbtn.classList.add('deleteProject');
          delbtn.classList.add('material-symbols-outlined');
          delbtn.textContent="Delete";
          delbtn.dataset.projectId=index;

          const editProject = document.createElement('span');
        editProject.classList.add('material-symbols-outlined');
        editProject.classList.add('editProject');
        editProject.textContent="Edit_Square";

          div.append(para);
          div.append(editProject);
          div.append(delbtn);
          projectArea.append(div);
      });
}
export {domEventListeners,addTask}