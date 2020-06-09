ALTER TABLE `Product`
	CHANGE COLUMN `description` `description` MEDIUMTEXT NOT NULL,
	CHANGE COLUMN `name` `name` TEXT NOT NULL;

ALTER TABLE `ProductSpecification`
	CHANGE COLUMN `value` `value` TEXT NOT NULL;
