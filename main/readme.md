# 구성

DiscordBot <---->  Server  <---->  MySQL



# Server
> RESTful 서버. DB와 연동 및 디스코드 봇 서버와 연동


# DiscordBot
> 디스코드 봇 서버. 지속적으로 웹 크롤링을 수행하며 목적에 맞는 킬보드를 찾을 경우, 해당 전투 식별자(BattleId)를 Server에 Get 방식으로 전달.

> 전달받은 Server은 DB에 업로드


