import path from 'path'
import fs from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

let LIBREOFFICE_PATH = process.env.LIBREOFFICE_PATH
if (!LIBREOFFICE_PATH) {
  const commonPaths = [
    "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
    "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
    "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    "/usr/bin/soffice",
    "/usr/bin/libreoffice"
  ]
  for (const p of commonPaths) {
    if (fs.existsSync(p)) {
      LIBREOFFICE_PATH = p
      break
    }
  }
}

export const convertPdfToDocx = async (req, res) => {
  try {
    // Enforce per-user usage limit (max 5 conversions)
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (req.user.usageCount >= 5) {
      return res.status(403).json({ message: 'Limit reached' })
    }

    req.user.usageCount += 1
    await req.user.save()

    // Validate that the uploaded file is a PDF
    if (req.file.mimetype !== 'application/pdf' && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'Uploaded file is not a PDF' })
    }

    // Ensure LibreOffice is actually installed and found
    if (!LIBREOFFICE_PATH || !fs.existsSync(LIBREOFFICE_PATH)) {
      throw new Error(`LibreOffice program not found! Please install LibreOffice on your computer.`)
    }

    // 1. Use absolute paths. LibreOffice headless often fails with relative paths.
    const originalInputPath = path.resolve(req.file.path)
    const outputDir = path.resolve(path.dirname(originalInputPath))

    // 2. Ensure input has a .pdf extension. If the file lacks an extension (common with Multer),
    // LibreOffice gets confused and silently fails to apply the PDF filter.
    const inputPath = `${originalInputPath}.pdf`
    fs.renameSync(originalInputPath, inputPath)

    const baseName = path.parse(inputPath).name
    const outputFilename = `${baseName}.docx`
    const outputPath = path.join(outputDir, outputFilename)

    // 3. Provide a unique user profile. If LibreOffice is open in the background,
    // the headless command will instantly crash/exit without converting.
    const profilePath = path.join(outputDir, `lo_profile_${Date.now()}`)
    const profileUri = `file:///${profilePath.replace(/\\/g, '/')}`

    // LibreOffice needs the writer_pdf_import filter to open PDFs in Writer instead of Draw.
    const args = [
      `-env:UserInstallation=${profileUri}`,
      '--headless',
      '--infilter=writer_pdf_import',
      '--convert-to',
      'docx',
      inputPath,
      '--outdir',
      outputDir
    ]

    // Execute LibreOffice command directly
    try {
      await execFileAsync(LIBREOFFICE_PATH, args)
    } catch (execError) {
      // Capture exactly what LibreOffice is complaining about
      console.error("LibreOffice Execution Failed. STDOUT:", execError.stdout, "STDERR:", execError.stderr)
      throw new Error(`LibreOffice command failed. See server console.`)
    }

    // Verify LibreOffice successfully created the output file
    if (!fs.existsSync(outputPath)) {
      throw new Error('Conversion process completed, but the DOCX file was not found.')
    }

    // 4. Cleanup temporary LibreOffice profile
    fs.rmSync(profilePath, { recursive: true, force: true })

    const filePath = `/uploads/${outputFilename}`
    const fileUrl = `${req.protocol}://${req.get('host')}${filePath}`

    return res.status(200).json({
      message: 'PDF successfully converted to DOCX',
      file: {
        originalName: `${path.parse(req.file.originalname).name}.docx`, // Send back a prettier name
        filename: outputFilename,
        path: filePath,
        url: fileUrl,
      },
    })
  } catch (error) {
    console.error('File conversion error:', error)
    return res.status(500).json({
      error: error.message || 'Failed to convert file. Please check server logs.'
    })
  }
}