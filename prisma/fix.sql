ALTER TABLE `Product`
	CHANGE COLUMN `description` `description` MEDIUMTEXT NOT NULL,
	CHANGE COLUMN `name` `name` TEXT NOT NULL,
	CHANGE COLUMN `slug` `slug` VARCHAR(255) NOT NULL;

ALTER TABLE `ProductSpecification`
	CHANGE COLUMN `value` `value` TEXT NOT NULL;
