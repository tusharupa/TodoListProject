import { project,projectMaster} from "./project"
import { displayTasks } from "./taskHandler";

const createProject = () =>{
    let projectId;
    const projectName=document.querySelector('#projectname').value;

    if(projectMaster.projectList)
    {
        projectId=projectMaster.projectList.length;
    }
    else
    {
        projectId=0;
    }
    const newProject=project(projectId,projectName);
    projectMaster.projectList.push(newProject);  //save projectList to local storage
    
    localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList));
    showProjects();
    displayTasks();
}
const showProjects =()=>{
    document.querySelector('.projectLabel').textContent="Tasks not under any Project!";
    const projectArea=document.querySelector('.projects');
    projectArea.innerHTML="";
    projectMaster.projectList.forEach((project,index)=>{
        const div = document.createElement('div');
        div.classList.add('projectDiv');
        div.setAttribute('data-project',project.title);
        div.setAttribute('data-project-index',index);
        project.id = index;
        const para=document.createElement('p');
        para.classList.add('projectText');
        para.textContent=project.title;

        const delbtn=document.createElement('button');
        delbtn.classList.add('deleteProject');
        delbtn.classList.add('material-symbols-outlined');
        delbtn.textContent="Delete";
        
        const editProject = document.createElement('span');
        editProject.classList.add('material-symbols-outlined');
        editProject.classList.add('editProject');
        editProject.textContent="Edit_Square";

        delbtn.dataset.projectId=index;
        div.append(para);
        div.append(editProject);
        div.append(delbtn);
        projectArea.append(div);
    });
}
const initializeProjectEvents = () => {
    const projectForm=document.querySelector('#projectform');
    const addProject=document.querySelector('#newproject');
    const submitProject=document.querySelector('#sbmtproject');
    const closeProjectForm=document.querySelector('.closeProjectForm');
    addProject.addEventListener('click',(e)=>{
        e.preventDefault();
        projectForm.classList.add('active');
    });
    submitProject.addEventListener('click',(e)=>{
        e.preventDefault();
        if(document.querySelector('#projectname').value=="")
        {
            projectForm.classList.remove('active');
            return;
        }
        projectForm.classList.remove('active');
        createProject();
        document.querySelector('#projectname').value="";
    });
    closeProjectForm.addEventListener('click',(e)=>{
        e.preventDefault();
        projectForm.classList.remove('active');
        document.querySelector('#projectname').value="";
    });
}
const listenProjectClicks = () => {
    const projectArea=document.querySelector('.projects');
    let projectLabel=document.querySelector('.projectLabel');
    let currentProject=undefined;
        let previousProject=undefined;
    projectArea.addEventListener('click',(e)=>{
        
        if(e.target.classList.contains('deleteProject'))
        {
            projectMaster.projectList.splice(e.target.closest('.projectDiv').dataset.projectIndex,1);
           
            localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList)); //update myProjectList after deletion
            showProjects();
            displayTasks();
        }
        else if(e.target.classList.contains('editProject'))
        {   
            
            const projectDiv=e.target.closest('.projectDiv');
            const projectID=projectDiv.dataset.projectIndex;
            const projectEditForm=document.querySelector('#editProject');
            const editProjectSubmit = document.querySelector('#editProjectSubmit');
            const closeEditProject = document.querySelector('.closeEditProjectForm');
    
            projectEditForm.classList.add('active');
    
            editProjectSubmit.addEventListener('click',(e)=>{
                e.preventDefault();
                if(document.querySelector('#editProjectTitle').value == "")
                {
                    projectEditForm.classList.remove('active');
                    return;
                }
                createEditProject(projectID);
                projectEditForm.classList.remove('active');
                clearEditProjectInputs();
            });
            closeEditProject.addEventListener('click',(e)=>{
                e.preventDefault();
                projectEditForm.classList.remove('active');
                document.querySelector('#editProjectTitle').value="";
            })
        }
        else if(e.target.closest('.projectDiv'))
        {
            
            currentProject=e.target.closest('.projectDiv');
            if(previousProject !== undefined)
            {
                previousProject.classList.remove('selectedProject');
                currentProject.classList.add('selectedProject');
                previousProject=currentProject;
               displayTasks();
               
            }
            else if(currentProject === previousProject)
            {
                return;
            }
            else
            {
                currentProject.classList.add('selectedProject');
                previousProject=currentProject;
               displayTasks();
               
            }
            projectLabel.textContent=currentProject.dataset.project;
        }
    });
    showProjects(); //showing projects on loading the page
    }
    function clearEditProjectInputs(){
        document.querySelector('#editProjectTitle').value="";
    }
    function createEditProject(projectID){
        const newProjectTitle = document.querySelector('#editProjectTitle').value;
        projectMaster.projectList[projectID].title = newProjectTitle;
        localStorage.setItem('myProjectList',JSON.stringify(projectMaster.projectList));
        showProjects();
        displayTasks();
    }
    
    export{ initializeProjectEvents,listenProjectClicks,showProjects }