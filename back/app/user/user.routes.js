import express from 'express'
import multer from 'multer'

import { protect } from '../../app/middleware/auth.middleware.js'
import { getAllUsers, getUserProfile, getUserProfileById, uploadImages} from '../../app/user/user.controller.js'

const router = express.Router()


// Настройки multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Папка для хранения изображений
  },
  filename: (req, file, cb) => {
		// const userId = req.user ? req.user.id : 'defaultUser '; // Замените на значение по умолчанию, если req.user не определен
    // cb(null, `${userId}-${Date.now()}-${file.originalname}`); // Уникальное имя файла
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + '-' + file.originalname); //
	},
});

const upload = multer({storage: storage})

// Определение маршрута.
router.route('/').get(protect, getAllUsers)
router.route('/profile').get(protect, getUserProfile)
router.route('/:id').get(protect, getUserProfileById)

// Маршрут для загрузки изображений
router.post('/images', protect, upload.array('images'), uploadImages);

export default router

