import { Router } from 'express'
import upload from '../middleware/uploadMiddleware.js'
import protect from '../middleware/authMiddleware.js'
import { convertPdfToDocx, convertPdfToJpg, convertJpgToPdf, getUsageInfo } from '../controllers/fileController.js'

const router = Router()

router.use(protect)

router.post('/upload', (req, res) => {
  upload.single('file')(req, res, (error) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size must be 10MB or less' })
      }

      return res.status(400).json({ error: error.message || 'File upload failed' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const filePath = `/uploads/${req.file.filename}`
    const fileUrl = `${req.protocol}://${req.get('host')}${filePath}`

    return res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: filePath,
        url: fileUrl,
      },
    })
  })
})

router.post('/convert', (req, res) => {
  upload.single('file')(req, res, (error) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size must be 10MB or less' })
      }

      return res.status(400).json({ error: error.message || 'File upload failed' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Proceed to the conversion controller
    return convertPdfToDocx(req, res)
  })
})

router.post('/pdf-to-jpg', (req, res) => {
  upload.single('file')(req, res, (error) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size must be 10MB or less' })
      }

      return res.status(400).json({ error: error.message || 'File upload failed' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    return convertPdfToJpg(req, res)
  })
})

router.post('/jpg-to-pdf', (req, res) => {
  upload.single('file')(req, res, (error) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size must be 10MB or less' })
      }

      return res.status(400).json({ error: error.message || 'File upload failed' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    return convertJpgToPdf(req, res)
  })
})

router.get('/usage', getUsageInfo)

export default router
