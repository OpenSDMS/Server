
import express  from 'express';
import crypto   from 'crypto';
import fs       from 'fs';
import multer   from 'multer';
import path     from 'path';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, process.env.SDMS_TMP as string); 
    },
    filename: (req, file, callback) => {
        callback(null, `${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname)}`);
    }
});


const upload = multer({ storage });
router.post('/', upload.single("file"), async (req: any, res: any) => {
    const file = req.file;
    const { systemName, systemUserName, createdAt, savePath } = req.body;
    
    if (!file || !systemName || !systemUserName || !createdAt) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing file or required fields'
        });
    }

    const newFileName    = `${systemName}_${systemUserName}_${createdAt}${path.extname(file.originalname)}`;
    const repositoryPath = path.join(process.env.SDMS as string, savePath);
    const findRepository = await prisma.objectMetaData.findUnique({ where: { id: repositoryPath } });
    
    if (!fs.existsSync(repositoryPath) || !findRepository) {
        return res.status(400).json({
            status: 'fail',
            result: 'REPOSITORY_NOT_FOUND'
        });
    }

    if (findRepository.type !== "REPOSITORY") {
        return res.status(400).json({
            status: 'fail',
            result: `${savePath}_IS_NOT_REPOSITORY`
        });
    }
    
    fs.rename(file.path, path.join(repositoryPath, newFileName), (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(`saveRawdata=${newFileName} from ${req.ip}`);
    });

    res.json({
        status: 'ok',
        message: 'File and data uploaded successfully'
    });
});

export default router;
