use bot;

CREATE TABLE IF NOT EXISTS battlelog(
    battleid INT PRIMARY KEY NOT NULL, -- 배틀 식별자
    totalkills INT NOT NULL, -- 전체 킬 수
    totalplayercount INT NOT NULL, -- 전체 전투 인원 수
    endtime DATETIME NOT NULL -- 전투 종료 시간
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS eventlog(
    eventid INT PRIMARY KEY NOT NULL, -- 이벤트 식별자
    endtime DATETIME NOT NULL, -- 이벤트 발생 종료 시간
    partymembercount INT NOT NULL, -- 파티 인원 수
    killarea VARCHAR(255) NOT NULL, -- 크리스탈 or 오픈월드
    battleid INT NOT NULL
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS playerlog(
	id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, -- 인덱스
    eventid INT NOT NULL, 
    username VARCHAR(255) NOT NULL, -- 이름
    guildname VARCHAR(255) NOT NULL, -- 길드명
    alliancename VARCHAR(255) NOT NULL, -- 얼라명
    killtype INT NOT NULL, -- 막타? 사망자? 도운자?
    damage INT, -- 가한 데미지
    heal INT, -- 가한 힐량
    
	avgip INT NOT NULL, -- 평균 아이템 레벨
    mainhand VARCHAR(255),
    offhand VARCHAR(255),
    head VARCHAR(255),
    armor VARCHAR(255),
    shoes VARCHAR(255),
    cape VARCHAR(255),
    potion VARCHAR(255),
    food VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hellgate55(
	checkvalue INT NOT NULL,
    battleid INT PRIMARY KEY NOT NULL
)ENGINE=InnoDB;