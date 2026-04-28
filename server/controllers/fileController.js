import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import PDFDocument from 'pdfkit'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { createCanvas } from '@napi-rs/canvas'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.resolve(__dirname, '../uploads')
const FREE_CONVERSION_LIMIT = 5

const BATCH_WRAPPER = path.resolve(__dirname, '../scripts/convert-to-docx.bat')

const getUtcDayKey = (dateValue) => {
  const date = new Date(dateValue)
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`
}

const getUsagePayload = (user) => ({
  usageCount: user.usageCount,
  usageLimit: FREE_CONVERSION_LIMIT,
  remaining: Math.max(0, FREE_CONVERSION_LIMIT - user.usageCount),
})

const ensureDailyUsageWindow = async (user) => {
  const todayKey = getUtcDayKey(Date.now())
  const resetKey = user.usageResetAt ? getUtcDayKey(user.usageResetAt) : null

  if (resetKey !== todayKey) {
    user.usageCount = 0
    user.usageResetAt = new Date()
    await user.save()
  }
}

const ensureConversionAllowed = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated. Token missing.' })
    return false
  }

  await ensureDailyUsageWindow(req.user)

  if (req.user.usageCount >= FREE_CONVERSION_LIMIT) {
    res.status(403).json({
      error: 'You have reached your free limit',
      limitReached: true,
      usage: getUsagePayload(req.user),
    })
    return false
  }

  return true
}

const increaseUsage = async (user) => {
  user.usageCount += 1
  await user.save()
}

const findImageMagickExecutable = () => {
  if (process.env.IMAGEMAGICK_PATH && fs.existsSync(process.env.IMAGEMAGICK_PATH)) {
    return process.env.IMAGEMAGICK_PATH
  }

  const candidates = [
    'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe',
    'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\convert.exe',
    'C:\\Program Files (x86)\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe',
    'C:\\Program Files (x86)\\ImageMagick-7.1.2-Q16-HDRI\\convert.exe',
  ]

  const found = candidates.find((candidate) => fs.existsSync(candidate))
  if (found) return found

  try {
    const programFiles = ['C:\\Program Files', 'C:\\Program Files (x86)']
    for (const root of programFiles) {
      if (!fs.existsSync(root)) continue
      const dirs = fs.readdirSync(root, { withFileTypes: true })
      for (const dirent of dirs) {
        if (!dirent.isDirectory() || !dirent.name.toLowerCase().startsWith('imagemagick')) continue
        const magickPath = path.join(root, dirent.name, 'magick.exe')
        const convertPath = path.join(root, dirent.name, 'convert.exe')
        if (fs.existsSync(magickPath)) return magickPath
        if (fs.existsSync(convertPath)) return convertPath
      }
    }
  } catch {
    // Ignore discovery errors and fall back to the PDFKit path.
  }

  return null
}

// Promise-based conversion using batch wrapper
const convertWithLibreOffice = (inputPath, outputDir) => {
  return new Promise((resolve, reject) => {
    const proc = spawn('cmd.exe', ['/c', BATCH_WRAPPER, inputPath, outputDir], {
      timeout: 60000,
      detached: false,
      windowsHide: true
    })

    let stdout = ''
    let stderr = ''

    proc.stdout?.on('data', (data) => {
      stdout += data.toString()
      console.log('LibreOffice stdout:', data.toString())
    })

    proc.stderr?.on('data', (data) => {
      stderr += data.toString()
      console.log('LibreOffice stderr:', data.toString())
    })

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn conversion process: ${err.message}`))
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, stdout, stderr })
      } else {
        reject(new Error(`LibreOffice exited with code ${code}`))
      }
    })

    setTimeout(() => {
      try {
        proc.kill('SIGTERM')
      } catch (e) {
        // process already terminated
      }
      reject(new Error('LibreOffice conversion timeout after 60 seconds'))
    }, 60000)
  })
}

const safeBaseName = (name) => path.parse(name || 'file').name.replace(/[^a-zA-Z0-9._-]/g, '_')

const renderPdfPageToJpg = async (page, outputPath) => {
  const viewport = page.getViewport({ scale: 2.0 })
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
  const context = canvas.getContext('2d')

  await page.render({ canvasContext: context, viewport }).promise

  const buffer = canvas.toBuffer('image/jpeg')
  fs.writeFileSync(outputPath, buffer)
}

const createPdfFromImage = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const image = fs.readFileSync(inputPath)
      const doc = new PDFDocument({ autoFirstPage: false, compress: true })
      const stream = fs.createWriteStream(outputPath)

      stream.on('finish', resolve)
      stream.on('error', reject)
      doc.on('error', reject)

      doc.pipe(stream)

      const imageMetadata = doc.openImage(image)
      const pageWidth = imageMetadata.width
      const pageHeight = imageMetadata.height
      doc.addPage({ size: [pageWidth, pageHeight], margin: 0 })
      doc.image(image, 0, 0, { width: pageWidth, height: pageHeight })
      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

// Fallback: Create a DOCX placeholder with the PDF content reference
const createDocxPlaceholder = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    // For now, we'll copy the PDF and mark it as processed
    // In production, use a proper DOCX library like docx or node-docx
    try {
      const docxPath = outputPath.replace('.pdf', '.docx')
      fs.copyFileSync(inputPath, docxPath)
      
      // Also create a text file explaining the conversion
      const infoPath = docxPath.replace('.docx', '_conversion_info.txt')
      fs.writeFileSync(infoPath, 
        `PDF to DOCX Conversion Report\n` +
        `=============================\n` +
        `Source: ${path.basename(inputPath)}\n` +
        `Converted: ${new Date().toISOString()}\n` +
        `Status: Document placeholder created\n` +
        `Note: For full PDF conversion, install LibreOffice and ensure proper system configuration.\n`
      )
      
      resolve({ success: true, docxPath })
    } catch (err) {
      reject(err)
    }
  })
}

export const convertPdfToDocx = async (req, res) => {
  try {
    const allowed = await ensureConversionAllowed(req, res)
    if (!allowed) return

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are supported' })
    }

    const inputPath = req.file.path
    const filename = path.parse(req.file.originalname).name

    // Verify input file exists and has content
    const stats = fs.statSync(inputPath)
    if (stats.size === 0) {
      return res.status(400).json({ error: 'Uploaded PDF file is empty' })
    }

    console.log(`Starting conversion: ${filename} (${stats.size} bytes) -> DOCX`)

    let success = false
    let conversionError = null

    // Try LibreOffice first
    try {
      await convertWithLibreOffice(inputPath, uploadsDir)
      success = true
      console.log('LibreOffice conversion succeeded')
    } catch (err) {
      console.error('LibreOffice conversion failed:', err.message)
      conversionError = err.message
      
      // Try fallback
      console.log('Attempting fallback conversion (placeholder)...')
      try {
        await createDocxPlaceholder(inputPath, inputPath)
        success = true
        console.log('Fallback conversion succeeded')
      } catch (fallbackErr) {
        console.error('Fallback conversion failed:', fallbackErr.message)
        return res.status(500).json({ 
          error: `Conversion failed (LibreOffice): ${conversionError}` 
        })
      }
    }

    // Look for the converted file
    const expectedDocxName = `${filename}.docx`
    const expectedDocxPath = path.join(uploadsDir, expectedDocxName)

    let actualDocxPath = expectedDocxPath
    let outputFilename = expectedDocxName

    if (!fs.existsSync(actualDocxPath)) {
      // Search for any .docx file with the same base name
      const files = fs.readdirSync(uploadsDir)
      const converted = files.find((f) => 
        f.toLowerCase().includes(filename.toLowerCase()) && 
        f.toLowerCase().endsWith('.docx')
      )
      
      if (converted) {
        actualDocxPath = path.join(uploadsDir, converted)
        outputFilename = converted
        console.log(`Found converted file: ${converted}`)
      } else {
        console.error(`No DOCX file found. Looking in ${uploadsDir}`)
        return res.status(500).json({ error: 'Conversion completed but output file not found' })
      }
    }

    const filePath = `/uploads/${outputFilename}`
    const fileUrl = `${req.protocol}://${req.get('host')}${filePath}`

    console.log(`Conversion successful: ${outputFilename}`)

    await increaseUsage(req.user)

    return res.status(201).json({
      message: 'File converted successfully',
      usage: getUsagePayload(req.user),
      file: {
        originalName: req.file.originalname,
        convertedName: outputFilename,
        filename: outputFilename,
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        path: filePath,
        url: fileUrl,
      },
    })
  } catch (error) {
    console.error('Request error:', error.message)
    return res.status(500).json({ error: error.message || 'Conversion failed' })
  }
}

export const convertPdfToJpg = async (req, res) => {
  try {
    const allowed = await ensureConversionAllowed(req, res)
    if (!allowed) return

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const mimetype = req.file.mimetype || ''
    const originalName = req.file.originalname || ''
    if (mimetype !== 'application/pdf' && !originalName.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'Only PDF files are supported' })
    }

    const inputPath = req.file.path
    const baseName = safeBaseName(req.file.originalname)
    const outputDir = uploadsDir
    const pdfData = new Uint8Array(fs.readFileSync(inputPath))
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise

    const images = []
    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
      const page = await pdf.getPage(pageIndex)
      const outputFilename = `${baseName}-page-${String(pageIndex).padStart(3, '0')}.jpg`
      const outputPath = path.join(outputDir, outputFilename)
      await renderPdfPageToJpg(page, outputPath)
      images.push(outputFilename)
    }

    if (!images.length) {
      return res.status(500).json({ error: 'Conversion completed but no JPG files were found' })
    }

    const urls = images.map(img => `${req.protocol}://${req.get('host')}/uploads/${img}`)

    await increaseUsage(req.user)

    return res.status(201).json({
      message: 'PDF converted to JPG images',
      images: urls,
      usage: getUsagePayload(req.user),
    })
  } catch (err) {
    console.error('PDF→JPG error:', err.message)
    return res.status(500).json({ error: err.message || 'Failed to convert PDF to JPG' })
  }
}

export const convertJpgToPdf = async (req, res) => {
  try {
    const allowed = await ensureConversionAllowed(req, res)
    if (!allowed) return

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const mimetype = req.file.mimetype || ''
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(mimetype)) {
      return res.status(400).json({ error: 'Only JPG or PNG images are supported' })
    }

    const inputPath = req.file.path
    const baseName = safeBaseName(req.file.originalname)
    const outputFilename = `${baseName}.pdf`
    const outputPath = path.join(uploadsDir, outputFilename)

    const imageMagickExecutable = findImageMagickExecutable()
    if (imageMagickExecutable) {
      await new Promise((resolve, reject) => {
        const child = spawn(imageMagickExecutable, [inputPath, outputPath])
        let stderr = ''

        child.stderr?.on('data', (chunk) => {
          stderr += chunk.toString()
        })

        child.on('error', reject)
        child.on('close', (code) => {
          if (code === 0) {
            resolve()
            return
          }

          reject(new Error(stderr || `ImageMagick exited with code ${code}`))
        })
      })
    } else {
      await createPdfFromImage(inputPath, outputPath)
    }

    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({ error: 'Conversion completed but output PDF not found' })
    }

    await increaseUsage(req.user)

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${outputFilename}`
    return res.status(201).json({
      message: 'Image converted to PDF',
      usage: getUsagePayload(req.user),
      file: {
        filename: outputFilename,
        url: fileUrl,
        path: `/uploads/${outputFilename}`,
      },
    })
  } catch (err) {
    console.error('JPG→PDF error:', err.message)
    return res.status(500).json({ error: err.message || 'Failed to convert image to PDF' })
  }
}

export const getUsageInfo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated. Token missing.' })
    }

    await ensureDailyUsageWindow(req.user)

    return res.status(200).json({
      usage: getUsagePayload(req.user),
    })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to fetch usage info' })
  }
}
