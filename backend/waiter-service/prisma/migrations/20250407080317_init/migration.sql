-- AlterTable
ALTER TABLE `order_item` MODIFY `status` ENUM('PENDING', 'PREPARING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
