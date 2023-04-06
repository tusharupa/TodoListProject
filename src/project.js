
const project = (id,title) =>{
    const taskList = [];
    return {
        id,title,taskList
     };
};

const projectMaster = (()=>{

    let projectList=JSON.parse(localStorage.getItem("myProjectList")) || [];
    let defaultProject = JSON.parse(localStorage.getItem('myDefaultProject')) || [];
    
    const push = (project) => projectList.push(project);
    const read =()=> projectList;
    // const findProject =(id) =>{
    //     const idNum= Number(id);
    //     return projectList.find((project)=>project.id === idNum);
    // };
    // const remove = (id) => {
    //     const idNum = Number(id);
    //         projectList.splice(idNum,1);
        
    //     };
        // const editProject = (id,title) =>{
        //     const idNum = Number(id);
        //     const thisProject = projectList.find((project)=>project.id===idNum);
        //     thisProject.title=title;
        // }
        return {
            push,read,projectList,defaultProject
        };
    })();
    
    export {project,projectMaster};