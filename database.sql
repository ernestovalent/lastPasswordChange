USE `empren95_testingdba` ;

-- -----------------------------------------------------
-- Create Table `empren95_testingdba`.`lastPasswordByUser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `empren95_testingdba`.`lastPasswordByUser` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `principalName` VARCHAR(150) NOT NULL,
  `givenName` VARCHAR(150) NULL,
  `lastChangePassword` DATETIME NOT NULL,
  `lastUpdate` DATETIME NULL,
  PRIMARY KEY (`id`))
  