
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
    await createRootUserIfNotExists();
})();

async function createRootUserIfNotExists () {
    const findRootUser = await prisma.user.findUnique({
        where: { id: 'root' }  
    });

    if (!findRootUser) {
        await prisma.user.create({
            data: {
                id: 'root',
                password: 'toor',
                name: 'root',
                isAdmin: true,
            }
        });
    }
}