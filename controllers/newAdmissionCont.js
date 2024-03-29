const newadmission = require("../models/newadmission.js");
const User = require("../models/studentmodel.js");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const jwt = require('jsonwebtoken');


async function uploadFileToCloudinary(file, folder) {
  const options = { folder, resource_type: "auto" };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

function isFileTypeSupported(filename, supportedTypes) {
  const fileType = filename.split(".").pop().toLowerCase();
  return supportedTypes.includes(fileType);
}

exports.newAdmission = async (req, res) => {
  try {
    // Destructure the required fields from the request body
    const {
      firstName,
      lastName,
      fatherName,
      motherName,
      email,
      date_of_birth,
      examType,
      application_exam_no,
      scoure_rank,
      cource_name,
      stream,
      phone_no,
      category,

      schoolName_10th,
      roll_No_10th,
      regisration_No_10th,
      board_Name_10th,
      year_of_passing_10th,
      persentage_10th,

      schoolName_12th,
      roll_No_12th,
      regisration_No_12th,
      board_Name_12th,
      year_of_passing_12th,
      persentage_12th,
      token,
    } = req.body;
   console.log(token);

// Example JWT and secret key (in a real scenario, the secret key should be stored securely)
let tokendata={};
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) {
    console.log('JWT verification failed:', err);
    // Handle invalid token
  } else {
    console.log('Decoded JWT payload:', decoded);
    tokendata=decoded;
    // Token is valid, handle the decoded payload
  }
});
    // Find the user by Token in the User model
    let userdata = await User.findOne({ _id:tokendata.id });
    console.log('Found user:', userdata);
    // Check if required fields are present in the request
    // if (!firstName || !email) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Missing required fields",
    //   });
    // }

    // Check if the user has already submitted an admission
    // const existingAdmission = await newadmission.findOne({ user: userdata._id });
    // // console.log(existingAdmission);/
    // console.log("aleray sumbit",existingAdmission);
    // if (existingAdmission) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'User already has an existing admission record.',
    //   });
    // }
    const passport_Photo_Size = req.files?.passport_Photo_Size;
    const aadhar_card_file = req.files && req.files.aadhar_card_file;
    const your_Residence_Certificate =
      req.files && req.files.your_Residence_Certificate;
    const sc_MarksheetFile = req.files && req.files.sc_MarksheetFile;
    const antiragging = req.file && req.file.antiragging;
    const rankcardFile = req.file && req.file.rankcardFile;
    const signature_or_Thumb = req.file && req.file.signature_or_Thumb;
    const files = [
      aadhar_card_file,
      passport_Photo_Size,
      your_Residence_Certificate,
      sc_MarksheetFile,
      antiragging,
      rankcardFile,
      signature_or_Thumb,
    ];
    // Validation for file types
    const supportedTypes = ["jpg", "jpeg", "png"];
    for (const file of files) {
      if (file && !isFileTypeSupported(file.name, supportedTypes)) {
        return res.status(400).json({
          message: `Unsupported file type for ${file.name}`,
          success: false,
        });
      }
    }
    const uploadedFiles = [];
    // Upload files to Cloudinary and store their URLs
    for (const file of files) {
      if (file) {
        const response = await uploadFileToCloudinary(file, `${firstName}_img`);
        console.log(response);
        uploadedFiles.push(response.secure_url);
      }
    }
    console.log(uploadedFiles[0]);
    console.log(uploadedFiles[1]);
    console.log(uploadedFiles[2]);
    console.log(uploadedFiles[3]);
    // Save details to the database using the newadmission model
    const newStudent = await newadmission.create({
      firstName,
      lastName,
      fatherName,
      motherName,
      email,
      date_of_birth,
      examType,
      application_exam_no,
      scoure_rank,
      cource_name,
      stream,
      phone_no,
      category,
      schoolName_10th,
      roll_No_10th,
      regisration_No_10th,
      board_Name_10th,
      year_of_passing_10th,
      persentage_10th,
      schoolName_12th,
      roll_No_12th,
      regisration_No_12th,
      board_Name_12th,
      year_of_passing_12th,
      persentage_12th,
      // rankcardFile,
      sc_MarksheetFile: uploadedFiles[0],
      aadhar_card_file: uploadedFiles[1],
      your_Residence_Certificate: uploadedFiles[2],
      hs_MarksheetFile: uploadedFiles[3],
      passport_Photo_Size: uploadedFiles[4],
      antiragging: uploadedFiles[6],
      rankcardFile: uploadedFiles[5],
      signature_or_Thumb: uploadedFiles[7],
      user: userdata._id,
    });
    
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: newStudent,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to create user. Please try again later.",
    });
  }
};





