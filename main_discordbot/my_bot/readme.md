# 데이터베이스 구조
> 간단하고 최소로 필요한 부분으로 구성

## TABLE battlelog
battleid | totalkills | totalplayers | starttime

## TABLE killevent
eventid | battleid | timestamp | groupmembercount | numberofparticipants | killarea

## TABLE player
id | version[0lastkiller, 1killer, 2victim] | avgip | eq_id | name | guildname | allianceName | killfame | deathfame | damagedone | supporthealingdone

killer = killFame, DamageDone, SupportHealingDone
victim = DeathFame


## TABLE equipment
id | mainhand | offhand | head | armor | shoes | cape | potion | food




# SQL
```sql
create database my_bot;
use my_bot;

CREATE TABLE IF NOT EXISTS battlelog (
    battleid INT PRIMARY KEY NOT NULL,
    totalkills INT NOT NULL,
    totalplayers INT NOT NULL,
    starttime TIMESTAMP NOT NULL,
    endtime TIMESTAMP NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS killevent (
    eventid INT PRIMARY KEY NOT NULL,
    battleid INT NOT NULL,
    starttime TIMESTAMP NOT NULL,
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

# timestamp -> datetime
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