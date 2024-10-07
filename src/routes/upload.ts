import express, { Request, Response } from 'express';
import { existsSync } from 'fs';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination (req, file, callback) {
        const { savePath } = req.body;

        console.log(req);

        if (!savePath) {
            return callback(new Error("MARFORMED_PARAMETER"), "");
        }

        const fullPath = path.join(process.env.SDMS as string, savePath);

        if (!existsSync(fullPath)) {
            return callback(new Error("REPOSITORY_NOT_FOUND"), "");
        }

        callback(null, fullPath);
    },
    filename (req, file, callback) {
        const { systemName, systemUserName, createdAt } = req.body;

        if (!systemName || !systemUserName || !createdAt) {
            return callback(new Error("MISSING_REQUIRED_FIELDS"), "");
        }

        callback(null, `${systemName}_${systemUserName}_${createdAt}`);
    }
});

const upload = multer({ storage });
router.post('/', upload.any(), async (req: Request, res: Response) => {
    res.json({
        status: "ok",
        result: "OK"
    });
});

export default router;
