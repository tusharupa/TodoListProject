
const project = (id,title) =>{
    let taskList = [];
    return {
        id,title,taskList
     };
};

const projectMaster = (()=>{

    let projectList = JSON.parse(localStorage.getItem("myProjectList")) || [];
    let defaultProject = JSON.parse(localStorage.getItem('myDefaultProject')) || [];
    
    const push = (project) => projectList.push(project);
    const read =()=> projectList;
    
        return {
            push,read,projectList,defaultProject
        };
    })();
    
    export {project,projectMaster};