# https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=1&sort=recent
> 알비온 온라인은 gameinfo에서 api 형식으로 전투 데이터를 보내준다. sort=recent로 최신 정보를 limit=1로 한개씩 받는다

키 예시는 아래와 같다
```json
[
  {
    "id": 474099831,
    "startTime": "2022-05-27T08:10:08.777379500Z",
    "endTime": "2022-05-27T08:11:55.510629200Z",
    "timeout": "2022-05-27T08:14:55.510629200Z",
    "totalFame": 92598,
    "totalKills": 3,
    "clusterName": null,
    "players": {
      "vfVeZ3IuSmCIOphM-Lvcdw": {
        "name": "BaronZBL",
        "kills": 0,
        "deaths": 1,
        "killFame": 0,
        "guildName": "Overseas Chinese Headquarters",
        "guildId": "r8tTOklsRVm2tr7Y7RzaVQ",
        "allianceName": "birdX",
        "allianceId": "Wd0NtWAcRGG6rWbrAzQ_IA",
        "id": "vfVeZ3IuSmCIOphM-Lvcdw"
      },
      "783x5ISNSFevEUrg8_9bXQ": {
        "name": "KOn454",
        "kills": 0,
        "deaths": 1,
        "killFame": 0,
        "guildName": "",
        "guildId": "",
        "allianceName": "",
        "allianceId": "",
        "id": "783x5ISNSFevEUrg8_9bXQ"
      },
      "0Nh8VEtVT625nSpWqp5Imw": {
        "name": "Tueuryuwen",
        "kills": 1,
        "deaths": 0,
        "killFame": 17646,
        "guildName": "P L A N E T",
        "guildId": "xGoPY90lQiqmQlYnS9kd9A",
        "allianceName": "",
        "allianceId": "",
        "id": "0Nh8VEtVT625nSpWqp5Imw"
      },
      "qbKVvzWWStaXGRDC6i8rSg": {
        "name": "OxWarrioryyds",
        "kills": 0,
        "deaths": 0,
        "killFame": 17646,
        "guildName": "P L A N E T",
        "guildId": "xGoPY90lQiqmQlYnS9kd9A",
        "allianceName": "",
        "allianceId": "",
        "id": "qbKVvzWWStaXGRDC6i8rSg"
      },
      "1hWxmpZZSeK2l8FfQquQGA": {
        "name": "Balujun110",
        "kills": 0,
        "deaths": 0,
        "killFame": 17646,
        "guildName": "P L A N E T",
        "guildId": "xGoPY90lQiqmQlYnS9kd9A",
        "allianceName": "",
        "allianceId": "",
        "id": "1hWxmpZZSeK2l8FfQquQGA"
      },
      "4ZN9LbrwRACtht4bDVCVyg": {
        "name": "olebaby",
        "kills": 0,
        "deaths": 1,
        "killFame": 0,
        "guildName": "Overseas Chinese Headquarters",
        "guildId": "r8tTOklsRVm2tr7Y7RzaVQ",
        "allianceName": "birdX",
        "allianceId": "Wd0NtWAcRGG6rWbrAzQ_IA",
        "id": "4ZN9LbrwRACtht4bDVCVyg"
      },
      "Si9mFO6wQaGn91lOyoMgmQ": {
        "name": "mosency",
        "kills": 1,
        "deaths": 0,
        "killFame": 19829,
        "guildName": "P L A N E T",
        "guildId": "xGoPY90lQiqmQlYnS9kd9A",
        "allianceName": "",
        "allianceId": "",
        "id": "Si9mFO6wQaGn91lOyoMgmQ"
      },
      "oZbCEQJMS9CPFMwDPjnrFg": {
        "name": "KingOvO",
        "kills": 1,
        "deaths": 0,
        "killFame": 19829,
        "guildName": "P L A N E T",
        "guildId": "xGoPY90lQiqmQlYnS9kd9A",
        "allianceName": "",
        "allianceId": "",
        "id": "oZbCEQJMS9CPFMwDPjnrFg"
      }
    },
    "guilds": {
      "r8tTOklsRVm2tr7Y7RzaVQ": {
        "name": "Overseas Chinese Headquarters",
        "kills": 0,
        "deaths": 2,
        "killFame": 0,
        "alliance": "birdX",
        "allianceId": "Wd0NtWAcRGG6rWbrAzQ_IA",
        "id": "r8tTOklsRVm2tr7Y7RzaVQ"
      },
      "xGoPY90lQiqmQlYnS9kd9A": {
        "name": "P L A N E T",
        "kills": 3,
        "deaths": 0,
        "killFame": 92596,
        "alliance": "",
        "allianceId": "",
        "id": "xGoPY90lQiqmQlYnS9kd9A"
      }
    },
    "alliances": {
      "Wd0NtWAcRGG6rWbrAzQ_IA": {
        "name": "birdX",
        "kills": 0,
        "deaths": 2,
        "killFame": 0,
        "id": "Wd0NtWAcRGG6rWbrAzQ_IA"
      }
    },
    "battle_TIMEOUT": 180
  }
]
```


# 키에 대한 설명
기준 = [0]
['id'] = 전투 번호. 숫자 형식
['startTime'] = 전투 시작 시간 UTC 기준
['endTime'] = 전투 종료 시간 UTC 기준
['timeout'] = ?
['totalFame'] = 얻은 총 페임량
['totalKills'] = 킬 수
['clusterName'] = ?
['players'] = 유저 json
['guilds'] = 길드 json
['alliances'] = 연합 json
['battle_TIMEOUT'] = ?

## players
기준 = [식별값] 유저 식별 값
['name'] = 유저 닉네임
['kills'] = 킬 수
['deaths'] = 데스 수
['killFame'] = 킬 페임
['guildName'] = 길드 명
['guildId'] = 길드 식별 id
['allianceName'] = 얼라 명
['allianceId'] = 얼라 식별 id
['id'] = 유저 식별 id

## guilds
기준 = [식별값] 길드 식별 id
['name'] = 길드 명
['kills'] = 킬 수
['deaths'] = 데스 수
['killFame'] = 킬 페임
['alliance'] = 얼라 명
['allianceId'] = 얼라 id
['id'] = 길드 식별 id

## alliances
기준 = [식별값] 얼라 식별 id
['name'] = 얼라 명
['kills'] = 킬 수
['deaths'] = 데스 수
['killFame'] = 킬 페임
['id'] = 얼라 식별 id


### 데이터 베이스1 battlelog
> battlelog
```sql
CREATE TABLE IF NOT EXISTS battlelog (
    killboard_id INT PRIMARY KEY NOT NULL,
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    totalFame INT,
    totalKills INT,
    players INT
) ENGINE=INNODB;
```

> battle_playerlog
```sql
CREATE TABLE IF NOT EXISTS battle_player(
    killboard_id INT,
    playerlog_id INT
)
```

> playerlog
```sql
CREATE TABLE IF NOT EXISTS playerlog(
    _id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    kills INT,
    deaths INT,
    killFame INT,
    guild_id VARCHAR(255),
    alliance_id VARCHAR(255) COMMENT ON '유저가 길드나 길드가 연합을 옮길 경우 값이 달라질 수 있기에 그때 그 값을 저장하기 위함'
)
```

> guild
```sql
CREATE TABLE IF NOT EXISTS guild(
    guild_id VARCHAR(255) PRIMARY KEY,
    guildname VARCHAR(255),
    alliance_id VARCHAR(255)
)
```

> alliance
```sql
CREATE TABLE IF NOT EXISTS alliance(
    alliance_id VARCHAR(255) PRIMARY KEY,
    alliancename VARCHAR(255)
)
```

https://gameinfo.albiononline.com/api/gameinfo/events/battle/474125722?offset=0&limit=51
### 데이터 베이스2 EVENT
battlelog의 totalkills만큼의 kill event가 존재한다.
[0] ~ [totalkills-1] 기준
[groupMemberCount] : 파티원 수 ??
[numberOfParticipants] : 영향을 준 유저 수
[EventId] : event id 값
[TimeStamp] : 킬한 시간 utc
[Version] : 4로 일단 고정?
[Killer] : 킬한 유저의 정보 json
[Victim] : 죽은 유저의 정보 json
[TotalVictimKillFame] : 총 페임량
[Locaation] : ?
[Participants] : 영향을 준 유저 정보들 json
[GroupMembers] : 파티원
[BattleId] : 킬보드
[KillArea] : 크리스탈이냐? 오픈월드냐?

#### Killer - 킬한 자
[AverageItemPower] : 평균 IP
[Equipment] : 착용 장비들 json
[Inventory] : 가지고 있는 아이템 json
[Name] : 이름
[Id] : 유저 식별자
[GuildName] : 길드 이름
[GuildId] : 길드 식별자
[AllianceName] 
[AllianceId]
[AllianceTag]
[Avatar]
[AvatarRing]
[DeathFame] 
[KillFame]
[FameRatio]

#### Victim - 죽은 자
[AverageItemPower] : 평균 IP
[Equipment]
[Inventory]
[Name]
[Id]
[GuildName]
[GuildId]
[AllianceName]
[AllianceId]
[AllianceTag]
[Avatar]
[AvatarRing]
[DeathFame]
[KillFame]
[FameRatio]


# 데이터베이스 구조 
> table : battelog
killboard_id PK
start_time
end_time
totalFrame
totalKills

> table : battelog_events
killboard_id
event_id

> table : events
event_id
groupMemberCount
numberOfParticipants
Timestamp
Victim_id - 사망자는 무조건 1명
TotalVictimKillFame
killer_ids - 공격자는 여러명

> table : victim
victim_id AI PK
AVR_IP
equiment_id - 착용 아이템
Name
GuildName
AlianceName
AlianceTag

> table : event_killers
event_id
killer_id

> table : killer
killer_id AI PK
equiment_id - 착용 아이템
Name
user_id
GuildName
AlianceName
AlianceTag

> table : equiment
equiment_id AI PK
"MainHand":"Type": "T6_MAIN_RAPIER_MORGANA@1"
"OffHand":"Type": "T4_OFF_SPIKEDSHIELD_MORGANA@3"
"Head":"Type": "T6_HEAD_LEATHER_MORGANA@1"
"Armor":"Type": "T5_ARMOR_LEATHER_MORGANA@2"
"Shoes":"Type": "T5_SHOES_LEATHER_SET2@2"
"Bag":"Type": "T4_BAG"
"Cape":"Type": "T4_CAPEITEM_FW_THETFORD@3"
"Mount":"Type": "T3_MOUNT_HORSE"
"Potion":"Type": "T7_POTION_STONESKIN"
"Food": null,