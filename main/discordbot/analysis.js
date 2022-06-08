// 입력 : 킬보드 id

/*
// 배틀 로그
https://gameinfo.albiononline.com/api/gameinfo/battles?offset=${i}&limit=1&sort=recent

{
    id : 배틀 로그
    startTime : 시작 시간
    endTime : 종료 시간
    timeout : ?
    totalFame : 킬 페임
    totalKills : 킬수
    clusterName : ?
    players : { } 플레이어 정보
    guilds : { }
    alliances : { }
}

https://gameinfo.albiononline.com/api/gameinfo/events/battle/${killboard_id}?offset=0&limit=${killcount}
{
    groupMemberCount : 파티원 수
    numberOfParticipants : 킬에 관련된 수
    EventId : 이벤트 id
    TimeStamp : 킬 발생 시간
    Version : 4 고정?
    Killer : {
        AverageItemPower : 아이피float
        Equipment : { }
        Inventory : { }
        Name : 이름
        Id : 유저 Id
        GuildName : 길드 명
        GuildId
        AllianceName
        AllianceId
        AllianceTag
        DeathFame
        KillFame : 킬의 경우 존재
        FameRatio
        LifetimeStatistics : { }
    }
    Victim : {
        AverageItemPower
        Equipment
        Inventory
        Name
        Id
        uildName : 길드 명
        GuildId
        AllianceName
        AllianceId
        AllianceTag
        DeathFame : 데스의 경우 존재
        KillFame
        FameRatio
        LifetimeStatistics : { }
    }
    TotalVictimKillFame : Victim의 데스 페임과 같다
    Location : ?
    Participants : {
        AverageItemPower
        Equipment
        Inventory
        Name
        Id
        GuildName
        GuildId
        AllianceName
        AllianceId
        AllianceTag
        Avatar
        AvatarRing
        DeathFame
        KillFame
        FAmeRatio
        LifetimeStatistics
        DamageDone
        SupportHealingDone
    }
    GroupMember : {}
    GvGMatch : null
    BattleId
    KillArea : OPEN_WORLD
    Category : null
    Type : KILL
}
*/

/*
1. 킬보드 정보를 얻는다
2. 킬보드 정보로 부터 킬 이벤트 정보들을 얻는다. 킬 이벤트 정보들을 배열에 저장한다.
    2.1. players = 10
    2.2. kill players [5~9]

json 파일 구조
{
    battleId = ?,       // 배틀로그
    totalKills = ?,     // 총 킬수
    totalPlayers = ?,   // 총 플레이어 수
    startTime = ?,
    killevent = [
        {
            eventId = ?,
            TimeStamp = ?,
            victim = {
                name,
                equiment
            },
            killers = [{
                name,
                equiment,
                damagedone,
                supporthealingdone
            },],
        },
    ]


}


--- 킬 이벤트 정보를 담은 배열
3. (json)배열을 분석하여 출력한다.
[배틀 로그]
    [막타친유저 🔪 피해자]
        [유저[데미지, 힐량] 🔪]
        ...
    ...
[배틀 로그 끝]
...



*/
async function analysis(battleId) {

}

function testjson() {
    let arrTotal = new Array();
    let Item = new Object();
    Item.id = 1234567;
    Item.name = 'Wanthealcome';
    Item.arrVictim = new Array();
    for (var i = 0; i < 10; i++) {
        let Victim = new Object();
        Victim.name = `Hello ${i}`;
        Item.arrVictim.push(Victim);
        arrTotal.push(Item);
    }


    console.log(arrTotal);
    console.log(arrTotal[0].arrVictim);

}

testjson();