import AddTask from '@/components/AddTask'
import DateTimeFilter from '@/components/DateTimeFilter'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StatAndFilter from '@/components/StatAndFilter'
import TaskList from '@/components/TaskList'
import TaskListPagination from '@/components/TaskListPagination'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { visibleTaskLimit } from '@/lib/data'

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);   //lay task tu task trong api                      
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [dateQuery, setDateQuery] = useState('today');
  const [page, setPage] = useState(1);
                                                       
  useEffect( ()=> {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => { setPage(1); }, [filter, dateQuery]); 

  const handleNext = () => {
    if(page < totalPage)
    {
      setPage((pre) => pre + 1);
    }
  };

  const handlePrev = () =>
  {
    if(page>1)
    {
      setPage((pre) => pre -1 );
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
  }

  const fetchTasks = async() => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);

      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completedCount);  

    } catch (error) {
      console.error("loi xay ra khi truy xuat task", error);
      toast.error("loi xay ra khi truy xuat task");
    }
  };

  // bien luu ds nvu da doc
  //filterTask = taskBuffer lưu giá trị của setTaskBuffer(res.data.tasks) lấy được hết task trong api res
  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "completed";
      default:
        return true;
    }
  });

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const totalPage = Math.ceil(filteredTasks.length/ visibleTaskLimit);

  //cắt trang (pagination) từ mảng filteredTasks để lấy đúng các task của trang hiện tại.
 {/* visibleTaskLimit = 5:

    page = 1 → slice(0, 5) → lấy phần tử index 0..4 (5 item đầu).

    page = 2 → slice(5, 10) → lấy index 5..9.

    page = 3 → slice(10, 15) → lấy index 10..14.
*/}

  const visibleTask = filteredTasks.slice(
    (page - 1 ) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  if(visibleTask.length === 0)
  {
    handlePrev();
  }

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
  {/* Dreamy Sky Pink + Blue Glow */}
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `
        /* xanh hơn & đậm hơn một chút */
        radial-gradient(circle at 25% 70%, rgba(135, 206, 250, 0.45), transparent 60%),
        /* hồng giữ nhẹ hơn để không át xanh */
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.32), transparent 62%),
        /* thêm một quầng xanh rất nhạt để blend */
        radial-gradient(circle at 50% 40%, rgba(173, 216, 230, 0.22), transparent 70%)
      `,
    }}
  />
  {/* Your Content/Components */}
  <div className="container relative z-10 pt-8 mx-auto">
    <div className="w-full max-w-2xl p-6 mx-auto space-y-6">

          {/* Header */}
          <Header/>

          {/* add nv */}
          <AddTask handleNewTaskAdded = {handleTaskChanged} />

          {/* Thong ke va filter */}
          <StatAndFilter
            completedTaskCount = {completeTaskCount}
            activeTaskCount = {activeTaskCount}
            filter = {filter}
            setFilter = {setFilter}
          />

          {/* Danh sach nv */}
          <TaskList filteredTasks={visibleTask} 
                    filter={filter} 
                    handleTaskChanged = {handleTaskChanged}
          />


          {/* Phân Trang và Lọc Theo Date */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
           <TaskListPagination
                    handleNext ={handleNext}
                    handlePrev = {handlePrev}
                    handlePageChange = {handlePageChange}
                    page = {page}
                    totalPage = {totalPage}

                  />
                  <DateTimeFilter
                    dateQuery={dateQuery}
                    setDateQuery={setDateQuery}
                  />
            </div>       

          {/* Footer */}
          <Footer/>
          

    </div>


  </div>
</div>
  );
};

export default HomePage;