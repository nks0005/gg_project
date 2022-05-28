use crawl;

CREATE TABLE IF NOT EXISTS battlelog (
    killboard_id INT PRIMARY KEY NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    totalFrame INT,
    totalKills INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS battlelog_killevent(
	killboard_id INT,
    killevent_id INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS killevent(
	killevent_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    groupMemberCount INT,
    numberOfParticipants INT,
    creat_time TIMESTAMP,
    Victim_id INT,
    TotalVictimKillFame INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS killevent_killer(
	killevent_id INT,
    killer_id INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS killer(
	killer_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    equiment_id INT,
    name VARCHAR(255),
    user_id INT,
    guildName VARCHAR(255),
    AlianceName VARCHAR(255),
    AlianceTag VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS victim(
	victim_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    equiment_id INT,
    name VARCHAR(255),
    user_id INT,
    guildName VARCHAR(255),
    AlianceName VARCHAR(255),
    AlianceTag VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS equiment(
	equiment_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    mainHand VARCHAR(255),
    offHand VARCHAR(255),
    head VARCHAR(255),
	armor VARCHAR(255),
    shoes VARCHAR(255),
    bag VARCHAR(255),
    cape VARCHAR(255),
    mount VARCHAR(255),
    potion VARCHAR(255),
    food VARCHAR(255)
) ENGINE=InnoDB;