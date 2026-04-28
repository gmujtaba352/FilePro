import fs from 'fs'
import path from 'path'
import multer from 'multer'

const uploadsDir = path.resolve(process.cwd(), 'uploads')

if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadsDir)
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
})

export default upload
