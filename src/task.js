import { projectMaster} from "./project";

const task = (id,name,date,projectID) => {
    let completed=false;
    let priority = false;
    return{
       id,name,date,projectID,completed,priority
    };
}
const taskMaster = (()=>{
    const push = (projectID,task) => projectMaster.projectList[projectID].taskList.push(task);

    const findTask = (projectID,taskID) => projectMaster.projectList[projectID].taskList[taskID]
    
    const removeTask = (projectID,taskID) => projectMaster.projectList[projectID].taskList.splice(taskID,1);
    
    return {
        push,
        findTask,
        removeTask
    };

})();

export {
    task,
    taskMaster
};
