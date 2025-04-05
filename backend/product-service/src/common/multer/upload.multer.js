import multer from "multer";
import path from "path";

// Xử lý tên và đuôi file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // req chứa thông tin user, file chứa thông tin file upload
    cb(null, "images/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // fileExtension đuôi mở rộng file
    const fileExtension = path.extname(file.originalname);

    const filenameString = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;

    cb(null, filenameString);
  },
});

const upload = multer({ storage: storage });

export default upload;
