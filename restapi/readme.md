# RESTful API ?
> RESTful API = REST 아키텍처의 제약 조건을 준수하는 애플리케이션 프로그래밍 인터페이스를 말한다
> Representational State Transfer의 줄임말
> Application Programming Interface; API는 애플리케이션 소프트웨어를 구축하고 통합하는 정의 및 프로토콜 세트
>> API를 사용자 또는 클라이언트, 그리고 사용자와 클라이언트가 얻으려 하는 리소스 사이의 조정자

RESTful API : 리소스 상태에 대한 표현을 요청자에게 전송
> 정보 또는 표현은 HTTP:JSON(Javascript Object Notation), HTML, XLT 또는 일반 텍스트를 통해 몇가지 형식으로 전송.
> JSON의 경우 사용 언어와 상관이 없고 인간과 머신 모두 읽을 수 있기에 널리 사용된다

## API가 RESTful로 될때의 기준
1. 클라이언트, 서버 및 리소스로 구성, 요청이 HTTP를 통해 관리되는 클라이언트-서버 아키텍처
2. stateless 클라이언트-서버 : 요청 간에 클라이언트 정보가 저장되지 않으며, 각 요청이 분리되어 있고 서로 연결되어 있지 않음
3. 클라-서버 상호 작용을 간소화하는 캐시 가능 데이터
4. 정보가 표준 형식으로 전송되도록 하기 위한 구성 요소 간 통합 인터페이스.
   1. 요청된 리소스가 식별 가능하며 클라이언트에 전송된 표현과 분리되어야 한다
   2. 수신한 표현을 통해 클라이언트가 리소스를 조작할 수 있어야 한다
   3. 클라이언트에 반환되는 자기 기술적(self-descriptive) 메시지에 클라이언트가 정보를 어떻게 처리해야할지 설명하는 정보가 충분히 포함
   4. 하이퍼미디어 : 클라이언트가 리소스에 액세스한 후 하이퍼링크를 사용해 현재 수행 가능한 기타 모든 작업을 찾을 수 있어야 한다
5. 요청된 정보를 검색하는 데 관련된 서버의 각 유형을 클라이언트가 볼 수 없는 계층 구조로 체계화하는 계층화 시스템
6. 코드 온디맨드(optional) : 요청을 받으면 서버에서 클라이언트로 실행 가능한 코드를 전송하여 클라이언트 기능을 확장할 수 있는 기능


# node js로 RESTful API 서버 구축
> HTTP URI(Uniform Resource Identifier)를 통해 데이터(자원)을 명시하고 Method(GET, POST, PUT, DELETE)를 통해 해당 데이터를 CRUD(Create, Read, Update, Delete)을 한다고 보면 된다.




# 참고 사이트
REST API(RESTful API, 레스트풀 API)란? 구현 및 사용법 [ https://www.redhat.com/ko/topics/api/what-is-a-rest-api ]
https://any-ting.tistory.com/14
