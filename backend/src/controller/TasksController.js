
import Task from "../models/Task.js";

export const GetAllTasks = async (req, res) => {
    const {filter='today'} = req.query;
    const now = new Date();
    let StartDate; 
    // const mặc định (bảo vệ code khỏi bị gán lại vô tình)
    //let khi biết chắc cần gán lại biến (ví dụ biến đếm, vòng lặp, trạng thái thay đổi)

    switch(filter)
    {
        case 'today': {
            StartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        }
        case 'week' :{
            const mondayDate = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1); 
            StartDate = new Date(now.getFullYear(), now.getMonth(), mondayDate)
            break;
        }
        case 'month':{
            StartDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        }
        case 'all':
            default:{
                StartDate = null;
            }
    }
    // gte is stand for greater than or equal to >= Nếu startDate có giá trị (truthy) 
    // → lọc theo ngày tạo: lấy những document có createdAt >= startDate.
    //createdAt >= startDate lọc từ mốc bắt đầu trở đi (không lấy những bản ghi cũ hơn).
    // Chỉ lấy task của user hiện tại
    const userQuery = { userId: req.user._id };
    const dateQuery = StartDate ? { createdAt: { $gte: StartDate } } : {};
    const query = { ...userQuery, ...dateQuery };

    try {
        // const tasks = await Task.find().sort({createdAt: "desc"}); //lay toan bo du lieu tu model Task or collection Task
        const result = await Task.aggregate([
            {
                $match: query
                //thì chỉ các task có createdAt >= startDate mới đi vào các bước sau.
            },
            //doi tuong pipeline $facet: Chạy nhiều pipeline con song song
            {
                $facet: {
                    // sap xep lai
                    tasks: [{$sort: {createdAt: -1 }}],
                    activeCount: [{$match: {status: "active"}}, {$count:"count"}],
                    completedCount: [{$match: {status: "completed"}}, {$count:"count"}],
                }
            }
        ]);

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0] ?.count || 0 ;
        const completedCount = result[0].completedCount[0] ?.count || 0 ;


        res.status(200).json({tasks, activeCount, completedCount});
    } catch (error) {
        console.error("loi khi goi getAllTasks", error);
        res.status(500).json({ message: "loi he thong"});
    }
}

export const CreateTask =  async (req, res)=>{
    try {
       const {title} = req.body;
       // Lưu userId vào task
       const tasks = new Task({title, userId: req.user._id});

       const NewTask = await tasks.save();
       res.status(201).json(NewTask);

    } catch (error) {
        console.error("loi khi goi CreateTask", error);
        res.status(500).json({ message: "loi he thong"});
    }
}

export const UpdateTask = async (req, res)=>{
    try {
        const {title, status, completedAt} = req.body;
        const UpdateTask = await Task.findByIdAndUpdate(
            req.params.id,{
                title,
                status,
                completedAt
            },
            {
                new:true
            }
        );
        if(!UpdateTask){
            return res.status(404).json({message: "nhiem vu khong ton tai"});
        }
        res.status(200).json({UpdateTask});

    } catch (error) {
        console.error("loi khi goi updateTask", error);
        res.status(500).json({ message: "loi he thong"});
    }
}

export const DeleteTask = async (req, res) => {
  try {
    const DeleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!DeleteTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json(DeleteTask);
  } catch (error) {
    console.error("Lỗi khi gọi DeleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};