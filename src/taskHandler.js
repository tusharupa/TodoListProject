import {task, taskMaster } from "./task"
import { projectMaster} from "./project";

const createTask = () => {
    let taskID;
    const taskName=document.querySelector('#title').value;
    const dateData=document.querySelector('#duedate').value;
    const projectID = Number(findCurrentProjectID());
    const taskDate = processDateData(dateData);
    if(projectID == -1)
    {
        if(!(projectMaster.defaultProject.length))
        {
            taskID = 0;
            const newTask = task(taskID,taskName,taskDate,projectID);
            projectMaster.defaultProject.push(newTask);
        }
        else
        {
        taskID = projectMaster.defaultProject.length;
        const newTask = task(taskID,taskName,taskDate,projectID);
        projectMaster.defaultProject.push(newTask);
        
        }
        localStorage.setItem('myDefaultProject',JSON.stringify(projectMaster.defaultProject)); //save defaultProject to local storage
    }
    else
    {
     taskID = projectMaster.projectList[projectID].taskList.length;
    const newTask = task(taskID,taskName,taskDate,projectID);
    taskMaster.push(projectID,newTask);
    
    localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList)); //save projectList to local storage
    }
    showTask();
};

const processDateData = (date) => (!date)?"No Due Date":date;

const showTask = () => {
const content = document.querySelector('.task-content');
content.innerHTML="";
const projectID=Number(findCurrentProjectID());

if(projectID == -1)
{ 
    document.querySelector('.projectLabel').textContent="Tasks not under any Project!";
    
    projectMaster.defaultProject.forEach((element,index) => {
        const div = document.createElement('div');
        div.classList.add('todoTask');
        div.setAttribute('data-task-index',index);
        div.setAttribute('data-task',element.name);
        element.id=index;
      

        const para = document.createElement('p');
        para.textContent= element.name;
        para.classList.add('taskText');

        const checkbox=document.createElement('span');
        checkbox.classList.add('checkbox');
        checkbox.classList.add('material-symbols-outlined');
        checkbox.textContent="Radio_Button_Unchecked";
        if(element.completed)
        {checkbox.classList.add('checked');
        checkbox.textContent="Check_Circle";
        para.classList.add('linethrough');
     }

        const dateInput=document.createElement('div');
        dateInput.textContent=element.date;
        dateInput.classList.add('taskDate');
        const delbtn = document.createElement('button');
        delbtn.classList.add('material-symbols-outlined');
    delbtn.textContent = "Delete";
        delbtn.classList.add('deleteTaskBtn');
        delbtn.dataset.taskID=element.id;

        const important=document.createElement('span');
        important.classList.add('important');
        important.classList.add('material-symbols-outlined');
        important.textContent="Star";
        if(element.priority)
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
    });
}
else{
    if(projectMaster.projectList[projectID].length == 0)
    {
        content.textContent="No tasks to show";
        
    }
    else 
    {

projectMaster.projectList[projectID].taskList.forEach((element,index) => {
    const div = document.createElement('div');
    div.classList.add('todoTask');
    div.setAttribute('data-task-index',index);
    div.setAttribute('data-task',element.name);
    element.id=index; 
    const para = document.createElement('p');
    para.textContent= element.name;
    para.classList.add('taskText');

    const checkbox=document.createElement('span');
       checkbox.classList.add('checkbox');
       checkbox.classList.add('material-symbols-outlined');
       checkbox.textContent="Radio_Button_Unchecked";
    if(element.completed)
   { checkbox.classList.add('checked');
   checkbox.textContent="Check_Circle";
    para.classList.add('linethrough');
    }

    
    const dateInput=document.createElement('div');
        dateInput.textContent=element.date;
        dateInput.classList.add('taskDate');
    const delbtn = document.createElement('button');
    delbtn.classList.add('material-symbols-outlined');
    delbtn.textContent = "Delete";
    delbtn.classList.add('deleteTaskBtn');
    delbtn.dataset.taskID=index;

    const important=document.createElement('span');
        important.classList.add('important');
        important.classList.add('material-symbols-outlined');
        important.textContent="Star";
        if(element.priority)
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
});
    }
}
}
const initializeTaskEvents = () => {
    const addTask = document.querySelector('.createTask');
    const submitTask=document.querySelector('#submitbtn');
    const formTask = document.querySelector('#taskform');
    const closeTask=document.querySelector('#taskClose');
    addTask.addEventListener('click',(e)=>{
        e.preventDefault();
        formTask.classList.add('active');
    });
    submitTask.addEventListener('click',(e)=>{
        e.preventDefault();
        if(document.querySelector('#title').value=="" && document.querySelector('#duedate').value=="")
        {
            formTask.classList.remove('active');
            clearInputs();
            return;
        }
        formTask.classList.remove('active');
        createTask();
        clearInputs();
    });
    closeTask.addEventListener('click',(e)=>{
        e.preventDefault();
        formTask.classList.remove('active');
        clearInputs();
    });
}

const clearInputs = () => {
    document.querySelector('#title').value="";
    document.querySelector('#duedate').value="";
}
const findCurrentProjectID = () => {
    const selectedProject = document.querySelector('.selectedProject');
    if(selectedProject == null)
    {
        return -1;
    }
    else
    return selectedProject.dataset.projectIndex;
}
const listenTaskClicks = () => {
const taskContent = document.querySelector('.task-content');
let projectID = findCurrentProjectID();
taskContent.addEventListener('click',(e)=>{
    if(e.target.classList.contains('deleteTaskBtn'))
    {
        if(projectID == -1)
        {
            projectMaster.defaultProject.splice(e.target.closest('.todoTask').dataset.taskIndex,1);
            
            localStorage.setItem('myDefaultProject',JSON.stringify(projectMaster.defaultProject)); //update defaultProject after deletion
        }
        else
        {
            projectMaster.projectList[projectID].taskList.splice(e.target.closest('.todoTask').dataset.taskIndex,1);
            
            localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList));
        }
        showTask(); //showing tasks after deletion
    }
    else if(e.target.classList.contains('checkbox'))
    {
        projectID = findCurrentProjectID();
        if(projectID == -1)
        {
            projectMaster.defaultProject[e.target.closest('.todoTask').dataset.taskIndex].completed = !(projectMaster.defaultProject[e.target.closest('.todoTask').dataset.taskIndex].completed);
            
            localStorage.setItem('myDefaultProject',JSON.stringify(projectMaster.defaultProject));
        }
        else
        { 
            
            projectMaster.projectList[projectID].taskList[e.target.closest('.todoTask').dataset.taskIndex].completed = !(projectMaster.projectList[projectID].taskList[e.target.closest('.todoTask').dataset.taskIndex].completed);
            localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList));
        }
        showTask();
    }
    else if(e.target.classList.contains('important'))
    {
        projectID=findCurrentProjectID();
        if(projectID == -1)
        {
            projectMaster.defaultProject[e.target.closest('.todoTask').dataset.taskIndex].priority = !(projectMaster.defaultProject[e.target.closest('.todoTask').dataset.taskIndex].priority);
            localStorage.setItem('myDefaultProject',JSON.stringify(projectMaster.defaultProject));
        }
        else
        {
            projectMaster.projectList[projectID].taskList[e.target.closest('.todoTask').dataset.taskIndex].priority = !(projectMaster.projectList[projectID].taskList[e.target.closest('.todoTask').dataset.taskIndex].priority);
            localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList));
        }
        showTask();
    }
    else if(e.target.classList.contains("editTask"))
    {
        const projectID= findCurrentProjectID();
        const taskID=e.target.closest('.todoTask').dataset.taskIndex;
        
        const editTaskForm = document.querySelector('#editTask');
        const editTaskSubmit=document.querySelector('#editTaskSubmit');
        const editTaskClose=document.querySelector('#editTaskClose');
        
        editTaskForm.classList.add('active');

        editTaskClose.addEventListener('click',(e)=>{
            e.preventDefault();
            editTaskForm.classList.remove('active');
            clearEditInputs();
        });

        editTaskSubmit.addEventListener('click',(e)=>{
            e.preventDefault();
            if(document.querySelector('#editTitle').value == "" && document.querySelector('#editDuedate').value == "")
            {
                editTaskForm.classList.remove('active');
                return;
            }
            editTaskForm.classList.remove('active');
            createEditTask(projectID,taskID);
            clearEditInputs();
        });
    }
});
showTask(); // initially showing tasks from defaultproject on loading page
}
function clearEditInputs(){
    document.querySelector('#editTitle').value="";
    document.querySelector('#editDuedate').value="";
}
function createEditTask(projectID,taskID)
{
    const editTaskTitle=document.querySelector('#editTitle').value;
    const editDateData=document.querySelector('#editDuedate').value;
    const editTaskDuedate=processDateData(editDateData);

    if(projectID == -1)
    {
        projectMaster.defaultProject[taskID].name=editTaskTitle;
        projectMaster.defaultProject[taskID].date=editTaskDuedate;
        localStorage.setItem('myDefaultProject',JSON.stringify(projectMaster.defaultProject));
    }
    else {
        projectMaster.projectList[projectID].taskList[taskID].name=editTaskTitle;
        projectMaster.projectList[projectID].taskList[taskID].date=editTaskDuedate;
        localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList));
    }
    showTask();
}
export {initializeTaskEvents,showTask,listenTaskClicks}