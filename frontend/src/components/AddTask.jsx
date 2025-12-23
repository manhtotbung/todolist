import React, { useState } from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const AddTask = ({handleNewTaskAdded}) => {

  const [NewTaskTitle, setNewTaskTitle] = useState(""); 
  const addTask = async() => {
      if(NewTaskTitle.trim()){
       try {
        await api.post('/tasks',{title:NewTaskTitle}); //Biến state của bạn tên NewTaskTitle (không có dấu nháy). Nếu muốn gửi giá trị người dùng nhập, phải truyền biến, không đặt trong dấu nháy:
        toast.success(`them nhiem vu ${NewTaskTitle} thanh cong`); 
        handleNewTaskAdded();
        
       } catch (error) {
        console.error('loi xay ra khi them nhiem vu', error);
        toast.error('loi xay ra khi them nhiem vu');
       }
       
       setNewTaskTitle("");

      }
      else 
        toast.error('ban can nhap noi dung cua nhiem vu');
  }

  const handleKeyPress = (event) =>{
    if(event.key === 'Enter')
    {
      addTask();
    }
  }
  return (
    <Card className='p-6 border-0 bg-gradient-card shadow-custom-lg'>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Input
          type='text'
          placeholder='Cần phải làm gì?'
          className='h-12 text-base bg-slate-50 sm: flex-1 border-border/50 focus:border-primary/50 focus: ring-primary/20'
          value = {NewTaskTitle}
          onChange = {(even) => setNewTaskTitle(even.target.value)}
          onKeyPress = {handleKeyPress}
        />
      <Button
        variant='gradient'
        size='xl'
        className='px-6 '
        onClick={addTask}
        disabled={!NewTaskTitle.trim()}
      >
        <Plus className='size-5'/>
        Thêm
      </Button>
      </div>
    </Card>
  )
}

export default AddTask