import { useEffect, useState } from 'react';
import './todoForm.css';
import './listTasks.css';
import Axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export const TodoForm = () => {
    const [todoList, setTodoList] = useState([])
    /* task name */
    const [todoTask, setTodoTask] = useState("")   
    /* Toggle between the edit and task */
    const [editingTask, setEditingTask] = useState(null);
    
    /* getting the value of the input field while typing */
    const textTyping = (event) => {
        setTodoTask(event.target.value);
    }
    const enableDisableEditing = (props) => {
        setEditingTask(props)
    }
      
    /* Fetch the data as tasks from the api using useQuery*/
    const {data:tasks, isLoading, isError} = useQuery(["task"], () => {
        return Axios.get("http://127.0.0.1:8000/api/todos").then((res)=>res.data)
    })

    /* Add new Task */
    const taskSubmit = () => {
        Axios.post(`http://127.0.0.1:8000/api/todo-create/`, {
            title: todoTask,
        }).then(response => {
            console.log('Task added successfully:', response.data)
            setTodoTask('')
            setTodoList([...todoList, response.data])
        })
        .catch( (error) => console.error('Error adding task:', error))
    }

    /*Adding the tasks to todoList while there is no error and loading*/
    useEffect(() => {
        if (!isLoading && !isError) {
          setTodoList(tasks);
        }
      }, [tasks, isLoading, isError])

    /* Update Task, set the editingTask to null */
    const updateTask = () => {
        Axios.post(`http://127.0.0.1:8000/api/todo-update/${editingTask.id}/`,{
            title: editingTask.title
        }).then(response => {
            console.log("Successfully added:", response.data)
    /* updating the todoList, setting editing textarea disappear */
            setTodoList(
                todoList.map((task)=>{
                    if(task.id === editingTask.id){
                        return { ...task, title: editingTask.title };
                    } else { return task }
                })
            )
            setEditingTask(null)
        })
        .catch((error)=> console.error("Error Updating Task:", error))
    }

    /* Deleting the task */
    const deleteTask = (taskId) => {
        Axios.delete(`http://127.0.0.1:8000/api/todo-delete/${taskId}`)
        .then(response => {
            console.log(`ID: ${taskId},`, response.data)
            setTodoList(todoList.filter((task) => task.id !== taskId))
        })
        .catch((error)=> {console.error(error);})
    }

    /* Changing the task status */
    const taskStatus = (task) => {
        Axios.post(`http://127.0.0.1:8000/api/todo-update/${task.id}/`,{
            title: task.title,
            completed: !task.completed
        }).then(response => {
            console.log("Status Changed", response.data)
    /* updating the todoList */
            setTodoList(
                todoList.map((tasklist)=>{
                    if(tasklist.id === task.id){
                        return { ...tasklist, completed: response.data.completed };
                    } else { return tasklist }
                })
            )
        })
        .catch((error)=> console.error("Error Updating Status", error))
    }

    return (
        <div>
            {/* Form which used to submit the tasks */}
            <div className='form'>
                <div className="form-group">
                    <textarea type="text" className="form-control task" id="task" placeholder="Enter your task" value={todoTask} onChange={textTyping} />
                </div>
                    <button type="submit" className="btn btn-warning add-task" onClick={taskSubmit}>Add Task</button>
            </div>
            {/* List of tasks */}
            <div className='task-box'>
            {todoList.map((task) => (
                <div key={task.id}>
                    {editingTask && editingTask.id === task.id ? (
                        <div  className='d-flex flex-row tasks p-2 border-bottom'>
                            <textarea cols="55" rows="1" value={editingTask.title} onChange={(e) =>
                                setEditingTask({ ...editingTask, title: e.target.value })
                            }></textarea>
                            <button className='btn btn-success btn-sm m-2' onClick={updateTask}>Update</button>
                        </div>
                        ):
                        (
                        <div className='d-flex flex-row tasks p-2 border-bottom'>
                            <div className='task-title' style={{flex:7, cursor:'pointer'}} onClick={()=>taskStatus(task)} >
                                {task.completed?(<strike>{task.title}</strike>):(<span>{task.title}</span>)}
                            </div>
                            <div className="edit" style={{flex:1}}><button className='btn btn-success btn-sm' onClick={() => enableDisableEditing(task)}>Edit</button></div>
                            <div className="delete" style={{flex:1}}><button className='btn btn-danger btn-sm' onClick={()=>deleteTask(task.id)}><b>-</b></button></div>
                        </div>
                        )}
                </div>
            ))}
        </div>
        </div>
    )
}
