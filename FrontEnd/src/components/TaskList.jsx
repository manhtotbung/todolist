import React from 'react'
import TaskEmptyState from './TaskEmptyState';
import TaskCard from './TaskCard';

const TaskList = ({filteredTasks, filter, handleTaskChanged}) => {

    if(!filteredTasks || filteredTasks.length === 0)
    {
        return <TaskEmptyState 
          filter = {filter}
        />
    }

  return (
    <div className='space-y-3 '> 
    
        {/* mỗi lần .map() chạy qua một phần tử của filteredTasks,
    tạo ra một TaskCard mới và gán cho nó ba thứ này. */}
    {/* vi du filterredTask trong homepage truyen vao la active thi o day gia trị là active (hàm mà dùng switch case) */}

    {filteredTasks.map((t, index) => (
      <TaskCard 
        key={t._id ?? index}
        task = {t}
        index = {index}
        handleTaskChanged = {handleTaskChanged}  
      />
    ))} 
     {/* task={t}: truyền nguyên object nhiệm vụ đó (không chỉ id) xuống component con TaskCard qua prop tên là task.
Ở TaskCard, prop này được nhận dạng { task, index, handleTaskChange } và bạn dùng task.title, task.status, task._id… để hiển thị/xử l */}
    {/* TaskCard nhận { task, index, handleTaskChange } và dùng task._id để xoá, task.title để hiển thị, */}
    </div>
  );
};

export default TaskList