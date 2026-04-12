const {
  assignmentSubmitted_get,
  assignmentSubmitted_id,
  assignmentSubmitted_add,
  assignmentSubmitted_update,
  assignmentSubmitted_delete
} = require('../controller/assignmentSubmitted.controller');

const authMiddleware = require('../middleware/auth.middleware');
const router = require('express').Router();
const multer = require("multer");

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ================= ROUTES =================
router.get('/', assignmentSubmitted_get);
router.get('/:assignmentSubmittedId', assignmentSubmitted_id);

router.post(
  '/add',
  authMiddleware,
  upload.single("file"),   // ✅ file upload enabled
  assignmentSubmitted_add
);

router.patch('/update/:_id', assignmentSubmitted_update);
router.delete('/delete/:_id', assignmentSubmitted_delete);

module.exports = router;