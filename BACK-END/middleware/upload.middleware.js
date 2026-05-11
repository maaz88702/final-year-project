const multer = require("multer");

const path = require("path");

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: function (
    req,
    file,
    cb
  ) {
    cb(
      null,
      "uploads/assignmentSubmitted"
    );
  },

  filename: function (
    req,
    file,
    cb
  ) {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );
  },
});

// ================= FILE FILTER =================
const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    // PDF
    "application/pdf",

    // DOC
    "application/msword",

    // DOCX
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // XLS
    "application/vnd.ms-excel",

    // XLSX
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // PPT
    "application/vnd.ms-powerpoint",

    // PPTX
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // IMAGES
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, DOCX, Excel, PPT, PPTX and image files are allowed"
      ),
      false
    );
  }
};

// ================= MULTER =================
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      20 * 1024 * 1024, // 20MB
  },
});

module.exports = upload;