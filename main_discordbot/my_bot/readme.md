# 파일 구조

## index.js
bot 구동

## hellgate.js
헬게이트 5v5 체크

## update_killboard.js
DB에 킬보드 업로드

## deploy-commands.js
디스코드에 명령어 추가



# 데이터베이스 구조
> 간단하고 최소로 필요한 부분으로 구성

## TABLE battlelog
'battleid', 'int', 'NO', 'PRI', NULL, ''
'totalkills', 'int', 'NO', '', NULL, ''
'totalplayers', 'int', 'NO', '', NULL, ''
'starttime', 'datetime', 'NO', '', NULL, ''
'endtime', 'datetime', 'NO', '', NULL, ''

## TABLE player
'playerid', 'varchar(255)', 'NO', 'PRI', NULL, ''
'whois', 'int', 'NO', '', NULL, ''
'avgip', 'int', 'NO', '', NULL, ''
'eqid', 'int', 'NO', '', NULL, ''
'playername', 'varchar(255)', 'NO', '', NULL, ''
'guildname', 'varchar(255)', 'YES', '', NULL, ''
'alliancename', 'varchar(255)', 'YES', '', NULL, ''
'killfame', 'int', 'YES', '', NULL, ''
'deathfame', 'int', 'YES', '', NULL, ''
'damage', 'int', 'YES', '', NULL, ''
'heal', 'int', 'YES', '', NULL, ''

## TABLE equipment
'eqid', 'int', 'NO', 'PRI', NULL, 'auto_increment'
'mainhand', 'varchar(255)', 'YES', '', NULL, ''
'offhand', 'varchar(255)', 'YES', '', NULL, ''
'head', 'varchar(255)', 'YES', '', NULL, ''
'armor', 'varchar(255)', 'YES', '', NULL, ''
'shoes', 'varchar(255)', 'YES', '', NULL, ''
'cape', 'varchar(255)', 'YES', '', NULL, ''
'potion', 'varchar(255)', 'YES', '', NULL, ''
'food', 'varchar(255)', 'YES', '', NULL, ''

## TABLE killevent
'eventid', 'int', 'NO', 'PRI', NULL, ''
'battleid', 'int', 'NO', '', NULL, ''
'starttime', 'datetime', 'NO', '', NULL, ''
'partymembercount', 'int', 'NO', '', NULL, ''
'killercount', 'int', 'NO', '', NULL, ''
'killarea', 'varchar(255)', 'NO', '', NULL, ''


# SQL
## timestamp -> datetime
```sql
use my_bot;

CREATE TABLE IF NOT EXISTS battlelog (
    battleid INT PRIMARY KEY NOT NULL,
    totalkills INT NOT NULL,
    totalplayers INT NOT NULL,
    starttime Datetime NOT NULL,
    endtime Datetime NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS killevent (
    eventid INT PRIMARY KEY NOT NULL,
    battleid INT NOT NULL,
    starttime Datetime NOT NULL,
    partymembercount INT NOT NULL,
    killercount INT NOT NULL,
    killarea VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS player(
    playerid VARCHAR(255) PRIMARY KEY NOT NULL ,
    whois INT NOT NULL,
    avgip INT NOT NULL,
    eqid INT NOT NULL,
    playername VARCHAR(255) NOT NULL,
    guildname VARCHAR(255),
    alliancename VARCHAR(255),
    killfame INT,
    deathfame INT,
    damage INT,
    heal INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS equiment(
    eqid INT AUTO_INCREMENT PRIMARY KEY,
    mainhand VARCHAR(255),
    offhand VARCHAR(255),
    head VARCHAR(255),
    armor VARCHAR(255),
    shoes VARCHAR(255),
    cape VARCHAR(255),
    potion VARCHAR(255),
    food VARCHAR(255)
) ENGINE=InnoDB;
```