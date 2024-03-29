const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();
require("dotenv").config();
//middleware  add
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(cors());
app.use(cookieParser());

const User = require("./models/studentmodel.js");
//routes
const signup = require("./routes/studentroute.js");
const signin = require("./routes/studentroute.js");
const forgotpassword=require("./routes/studentroute.js");
const resetpassword=require("./routes/studentroute.js");
const job = require("./routes/studentroute.js");
const newAdmission = require("./routes/studentroute.js");
const getNewAdmissionById = require("./routes/studentroute.js");
const exitStudent = require("./routes/studentroute.js");
const pg_cource = require("./routes/studentroute.js");
const get_exitstudent= require("./routes/studentroute.js")
const get_pg_student= require("./routes/studentroute.js");
const get_job_student=require('./routes/studentroute.js');

const getsigin_ById= require("./routes/studentroute.js");
//fetch data all student records
const get_new_admission=require('./routes/studentroute.js')
const get_all_exit_student=require('./routes/studentroute.js');

const get_all_pgcource_student=require('./routes/studentroute.js');
const get_all_Job_student=require('./routes/studentroute.js');

const delete_newadmission=require('./routes/studentroute.js');
const delete_id_exitstudent=require('./routes/studentroute.js');
const delete_id_pgstudent=require('./routes/studentroute.js');

const  update_New_Admission=require('./routes/studentroute.js');
//dbconnect
require("./config/dbconnect").connect();

//cloud se connect
const cloudinary = require("./config/cloudinary.js");
cloudinary.cloudinaryConnect();
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/v1", signup);
app.use("/api/v1", signin);
app.use("/api/v1",forgotpassword);
app.use("/api/v1",resetpassword);
// app.use("/api/v1/reasetpassword/:token", reasetpassword);
app.use("/api/v1", job);
app.use("/api/v1", newAdmission);
app.use("/api/v1", exitStudent);
app.use("/api/v1", pg_cource);
app.use("api/v1", getNewAdmissionById);
app.use('/api/v1',get_exitstudent);
app.use("/api/v1",get_pg_student);
app.use("/api/v1",get_job_student);
app.use('/api/v1',get_new_admission);
app.use('/api/v1',get_all_exit_student);
app.use('/api/v1',delete_newadmission);
app.use('/api/v1',get_all_Job_student);
app.use('/api/v1',getsigin_ById);
// delete routes for api/v1
app.use('api/v1',get_all_pgcource_student);
app.use('/api/v1',delete_id_exitstudent);
app.use('api/v1',delete_id_pgstudent);
// delete

app.use("api/v1", update_New_Admission,);
app.get("/allstudents", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    // If no users found
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    // If users found, respond with the user data
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve users" });
  }
});
app.listen(PORT, () => {
  console.log(`Example app listening  port ${PORT}`);
});
