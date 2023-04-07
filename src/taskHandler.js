import {task, taskMaster } from "./task"
import { projectMaster} from "./project";
import { addTask } from "./dom";

const createTask = () => {
    let taskID;
    const taskName=document.querySelector('#title').value;
    const dateData=document.querySelector('#duedate').value;
    let projectID = findCurrentProjectID();
    const taskDate = processDateData(dateData);
    if(projectID == -1)
    {
        if(projectMaster.defaultProject.length > 0)
        {
            taskID = projectMaster.defaultProject.length;
        const newTask = task(taskID,taskName,taskDate,projectID);
        projectMaster.defaultProject.push(newTask);
        }
        else
        {
            taskID = 0;
            const newTask = task(taskID,taskName,taskDate,projectID);
            projectMaster.defaultProject.push(newTask);
        
        }
        localStorage.setItem('myDefaultProject',JSON.stringify(projectMaster.defaultProject)); //save defaultProject to local storage
    }
    else
    {
        if(projectMaster.projectList[projectID].taskList.length > 0)
        {
            taskID = projectMaster.projectList[projectID].taskList.length;
            const newTask = task(taskID,taskName,taskDate,projectID);
            projectMaster.projectList[projectID].taskList.push(newTask);
        }
        else
        {
            taskID=0;
            const newTask = task(taskID,taskName,taskDate,projectID);
            projectMaster.projectList[projectID].taskList.push(newTask);
        }
    
    localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList)); //save projectList to local storage
    }
    displayTasks();
};

const processDateData = (date) => (!date)?"No Due Date":date;

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
    if(!(selectedProject))
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
        projectID = findCurrentProjectID();
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
        displayTasks();
        
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
        displayTasks();
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
        displayTasks();
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
document.querySelector('.projectLabel').textContent="Tasks not under any Project!";
displayTasks(); // initially showing tasks from defaultproject on loading page
}
function displayTasks(){
    document.querySelector('.task-content').textContent="";
    let projectID = findCurrentProjectID();
    if(projectID == -1)
    {
        console.log(projectMaster.defaultProject);
        if(projectMaster.defaultProject.length > 0)
        {
        projectMaster.defaultProject.forEach((task,index) => {
            task.id = index;
            addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
        });
    }
    else
    document.querySelector('.task-content').textContent="No tasks to show!";
    }
    else
    {
        console.log(projectMaster.projectList);
        if(projectMaster.projectList.length > 0 && projectMaster.projectList[projectID].taskList.length > 0)
        {
        projectMaster.projectList[projectID].taskList.forEach((task,index) => {
            task.id = index;
            addTask(task.id,task.name,task.date,task.projectID,task.completed,task.priority);
        });
    }
    else
    document.querySelector('.task-content').textContent="No tasks to show!";
    }
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
    displayTasks();
}
export {initializeTaskEvents,displayTasks,listenTaskClicks}