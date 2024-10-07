
import { PrismaClient } from '@prisma/client';
import fs   from 'fs';
import path from 'path';

const ROOT   = process.env.SDMS || "/";
const prisma = new PrismaClient();

export async function createRepository (userId: string, destination: string, objectName: string) {
    let fullPath = path.join(ROOT, destination);

    if (!fs.existsSync(fullPath)) {
        throw new Error("MARFORMED_DESTINATION");
    }

    fullPath = path.join(ROOT, destination, objectName);
    try {
        fs.mkdirSync(fullPath);

        const resultMetadata = await prisma.objectMetaData.create({
            data: {
                id: fullPath,
                userId,
                type: "REPOSITORY" 
            }
        });

        return resultMetadata;
    }
    catch {
        if (fs.existsSync(fullPath)) {
            fs.rmdirSync(fullPath);
        }
        
        throw new Error("CREATE_REPOSITORY_TX_FAILED");
    }
}