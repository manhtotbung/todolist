import React, { useState } from 'react'
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import api from '@/lib/axios';


//   {/* {filteredTasks.map((t, index) => (
//   <TaskCard
//     key={t._id ?? index}
//     task={t}           // <-- truyền prop tên "task"
//     index={index}
//   />
// ))} task của taskcard được truyền từ đây */}
const TaskCard = ({task, index, handleTaskChanged}) => {

    const[isEditting, setIsEditting] = useState(false);
    const[updateTaskTiltle, setupdateTaskTiltle] = useState(task.title || "");

   const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success('xoa thanh cong');
            handleTaskChanged(); 
        } catch (error) {
            console.error('loi xay ra khi xoa nhiem vu', error);
            toast.error('loi xay ra khi xoa nhiem vu');
        }
    };

    const handleKeyPress = (event) => {
        if(event.key==="Enter")
            {
                updateTask();
            }
    }
    
    const updateTask = async() =>{
        try {
            setIsEditting(false);
            await api.put(`/tasks/${task._id}`, {
                title: updateTaskTiltle
            })
            toast.success('sua thanh cong!');
            handleTaskChanged();
        } catch (error) {
            console.error('loi xay ra khi sua nhiem vu', error);
            toast.error('loi xay ra khi sau nhiem vu');
        }
    }

    const toggleTaskCompleteBtn = async() =>{
        try {
            if(task.status === 'active'){
                await api.put(`/tasks/${task._id}`, {
                status: "completed",
                completedAt: new Date().toISOString(),
            });
                toast.success(`${task.title} da hoan thanh`);
            }
            else if(task.status === 'completed')
            {
                await api.put(`/tasks/${task._id}`, {
                    status:'active',
                    completedAt: null
                })
                 toast.success(`${task.title} da doi sang chua hoan thanh`);
            }
        handleTaskChanged();
        } catch (error) {
            console.error('loi xay ra khi sua nhiem vu', error);
            toast.error('loi xay ra khi sau nhiem vu');          
        }
    }
  return (
   <Card className={cn('p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group', 
   task.status === 'complete' && 'opacity-75')} style ={{animationDelay: `${index * 50}ms`}}
   >
   <div className='flex items-center gap-4'>

        {/* nut tron */}
        <Button variant='ghost' 
                size= 'icon'
                className={cn("flex-shrink-0 size-8 rounded-full transition-all duration-200", 
                    task.status === 'completed' 
                    ? "text-success hover:text-success/80"
                    : "text-muted-foreground hover:text-primary"
                )}
                onClick = {toggleTaskCompleteBtn}
        >
            {task.status === 'completed'? 
                (
                    <CheckCircle2 className='size-s'/>
                ) 
                :
                (
                    <Circle className='size-5'/>
                )}
        
        </Button>

        {/* hien thi chinh sua tieu de */}
        <div className='flex-1 min-w-0'>
                {isEditting ? 
                    (
                        <Input 
                            placeholder ='can phai lam gi?'
                            className='flex-1 h-12 text-base border-b-orange-50 focus:border-primary/50 focus:ring-primary/20'
                            type='text'
                            value = {updateTaskTiltle}
                            onChange = {(e) => setupdateTaskTiltle(e.target.value)}
                            onKeyPress = {handleKeyPress}
                            onBlur = {
                                () => {
                                    isEditting(false);
                                    SetupdateTaskTiltle(task.title || "");
                                }
                            }
                        />
                    ) 
                    :
                    (
                        <p className={cn('text-base transition-all duration-200', 
                            task.status === 'completed' ? 
                            'line-through text-muted-foreground' :
                            'text-foreground'
                        )}>
                        {task.title}
                        </p>
                    )
                }

                {/* ngay tao va ngay hoan thanh */}
                <div className='flex items-center gap-2 mt-1'>
                    <Calendar className='size-3 text-muted-foreground'/>
                        <span className='text-xs text-muted-foreground'>
                            {new Date(task.createdAt).toLocaleString()} 
                        </span>

                        {task.completedAt && (
                            <>
                                <span className='text-xs text-muted-foreground'> - </span>
                                <Calendar className='size-3 text-muted-foreground' />
                                <span className='text-xs text-muted-foreground'>
                                    {new Date(task.completedAt).toLocaleString()}
                                </span>
                            </>
                        )}

                </div>
        </div>
   
        {/* nut chinh va xoa */}
        <div className='hidden gap-2 group-hover:inline-flex animate-slide-up'> 
            {/* nut edit */}
            <Button 
                variant='ghost'
                size='icon'
                className='flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info'
                onClick ={
                    () => {
                        setIsEditting(true);
                        updateTaskTiltle(task.title || "");
                    }
                }
            >
                <SquarePen className='size-4' />
                
            </Button>

            {/* xoa btn */}
              <Button 
                variant='ghost'
                size='icon'
                className='flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive'
                onClick={() => deleteTask(task._id)}
                
            >
                <Trash2 className='size-4'/>

            </Button>
        </div>
    </div>     
   </Card>
  );
};

export default TaskCard