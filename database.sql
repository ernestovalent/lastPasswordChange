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
  

-- Mayor a 90 dias
SELECT principalName,givenName,lastChangePassword FROM lastPasswordByUser WHERE lastChangePassword <= '2021-04-13' ORDER BY lastChangePassword ASC

/* Quiero recordarte que la contraseña de tu cuenta ecaamal@xcaret.com ha expirado, 
debido a que no la has cambiado por más de 3 meses. Es muy posible que pierdas la conectividad
con muchos de los servicios y aplicaciones del grupo. Además por seguridad te recomendamos
cambiarlo muy pronto. */


-- Entre 85 a 90 dias 
SELECT principalName,givenName,lastChangePassword FROM lastPasswordByUser WHERE lastChangePassword BETWEEN '2021-04-13' AND '2021-04-18' ORDER BY lastChangePassword ASC

/* Quiero recordarte que la contraseña de tu cuenta ecamal@xcaret.com está a punto de caducar. 
Por favor cambia tu contraseña o podrías perder la conectividad de muchos de los servicios y aplicaciones
del grupo. Además por seguridad te recomendamos cambiarla pronto. */

-- Entre 80 a 85 dias
SELECT principalName,givenName,lastChangePassword FROM lastPasswordByUser WHERE lastChangePassword BETWEEN '2021-04-18' AND '2021-04-23' ORDER BY lastChangePassword ASC

/* Quiero recordarte que la contraseña de tu cuenta ecaamal@xcaret.com no ha cambiado en varias semanas.
Por seguridad te recomendamos cambiarla pronto. */