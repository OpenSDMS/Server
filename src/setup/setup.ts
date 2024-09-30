
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

(async () => {
    await createRootUserIfNotExists();
})();

async function createRootUserIfNotExists () {
    let root = await prisma.user.findUnique({
        where: { id: 'root' }  
    });

    if (!root) {
        root = await prisma.user.create({
            data: {
                id: 'root',
                password: 'toor',
                name: 'root',
                isAdmin: true,
            }
        });
    }

    // ADMIN TOKEN FOR TEST
    console.log(jwt.sign(JSON.stringify({id: root.id, isAdmin: root.isAdmin}), process.env.SECRET_KEY as string));
}