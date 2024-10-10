-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NULL DEFAULT false,
    `isReset` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectMetaData` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('DEVICE', 'REPOSITORY', 'RAWDATA') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObjectMetaDataExtention` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `objectMetaDataId` VARCHAR(191) NOT NULL,
    `rawDataPath` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ObjectMetaDataExtention_objectMetaDataId_key`(`objectMetaDataId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HostIps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `host` VARCHAR(191) NOT NULL,
    `objectId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ObjectMetaData` ADD CONSTRAINT `ObjectMetaData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObjectMetaDataExtention` ADD CONSTRAINT `ObjectMetaDataExtention_objectMetaDataId_fkey` FOREIGN KEY (`objectMetaDataId`) REFERENCES `ObjectMetaData`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HostIps` ADD CONSTRAINT `HostIps_objectId_fkey` FOREIGN KEY (`objectId`) REFERENCES `ObjectMetaData`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
