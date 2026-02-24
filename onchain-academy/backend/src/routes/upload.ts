import { Router, Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// ─── Cloudinary Config ────────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Local Storage Config (for PDFs) ───────────────────────────────────────────
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
    fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

// ─── Multer Logic ─────────────────────────────────────────────────────────────
const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage for initial check
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit (videos can be large)
});

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload utilities
 */

/**
 * @swagger
 * /upload/asset:
 *   post:
 *     summary: Upload an asset (image, video, or PDF)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Asset to upload (Images/Videos go to Cloudinary, PDFs to local disk)
 *     responses:
 *       200:
 *         description: Upload successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 url:
 *                   type: string
 *                   description: Absolute Cloudinary URL or relative local path
 *                 type:
 *                   type: string
 *                   enum: [local, cloudinary]
 */
router.post(
    "/asset",
    authenticate,
    requireAdmin,
    upload.single("file"),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: "No file provided" });
                return;
            }

            const mimeType = req.file.mimetype;

            if (mimeType === "application/pdf") {
                // ─── Handle PDF locally ───────────────────────────────────────────────
                const filename = `file-${Date.now()}-${req.file.originalname}`;
                const filePath = path.join(LOCAL_UPLOAD_DIR, filename);
                fs.writeFileSync(filePath, req.file.buffer);

                res.status(200).json({
                    success: true,
                    url: `/uploads/${filename}`,
                    type: "local",
                });
            } else {
                // ─── Handle Images/Videos via Cloudinary ──────────────────────────────
                const isVideo = mimeType.startsWith("video/");

                // Upload via stream since we used memoryStorage
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "sollearn-assets",
                        resource_type: isVideo ? "video" : "image",
                    },
                    (error, result) => {
                        if (error || !result) {
                            console.error("[Cloudinary] Upload error:", error);
                            res.status(500).json({ success: false, message: "Cloudinary upload failed" });
                            return;
                        }
                        res.status(200).json({
                            success: true,
                            url: result.secure_url,
                            type: "cloudinary",
                        });
                    }
                );

                uploadStream.end(req.file.buffer);
            }
        } catch (err) {
            console.error("[Upload] Error:", err);
            res.status(500).json({ success: false, message: "Server error during upload" });
        }
    }
);

export default router;
