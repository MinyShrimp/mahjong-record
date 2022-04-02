## 참고 링크
* [기본 문법](http://www.tcpschool.com/mysql/mysql_basic_syntax)

## 설치
* brew install mysql@5.7 mysql-client@5.7

## 도커
* docker run --platform linux/amd64 -p 3306:3306 --name mysql-container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=Account -e MYSQL_PASSWORD=root -d mysql:5.7

## 빌드
* docker-compose up -d

## 유저 기반 Database
| Name       | Type        | 설명                |
| ---------- | ----------- | ------------------- |
| ID         | INT         | -                   |
| Name       | VARCHAR(30) | 이름                |
| Uma        | INT         | 총 우마             |
| Score      | INT         | 누적 점수           |
| MaxScore   | INT         | 최고점              |
| Star       | INT         | 누적 별 갯수        |
| Count      | INT         | 총 국수             |
| Rank_1     | INT         | 1등 횟수            |
| Rank_2     | INT         | 2등 횟수            |
| Rank_3     | INT         | 3등 횟수            |
| Rank_4     | INT         | 4등 횟수            |
| UpdateTime | TIMESTAMP   | 언제 업데이트했는지 |

```
CREATE TABLE UserRecord (
    ID         INT AUTO_INCREMENT PRIMARY KEY,
    Name       VARCHAR(30) NOT NULL,
    Uma        INT DEFAULT 0,
    Score      INT DEFAULT 0,
    MaxScore   INT DEFAULT 0,
    Star       INT DEFAULT 0,
    Count      INT DEFAULT 0,
    Rank_1     INT DEFAULT 0,
    Rank_2     INT DEFAULT 0,
    Rank_3     INT DEFAULT 0,
    Rank_4     INT DEFAULT 0,
    UpdateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARACTER SET UTF8;
```
```
DROP TABLE UserRecord;
DELETE FROM UserRecord;
ALTER TABLE UserRecord AUTO_INCREMENT=1;
SELECT ID, Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4 FROM UserRecord;

INSERT INTO 
    UserRecord(Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4) 
    VALUES(      "",   0,     0,        0,    0,     0,      0,      0,      0,      0);

UPDATE UserRecord
    SET Uma="", Score=0, MaxScore=0, Star=0, Count=0, Rank_1=0, Rank_2=0, Rank_3=0, Rank_4=0
    WHERE ID = id;
```

## 인덱스 기반 Database
| Name        | Type         | 설명                        |
| ----------- | ------------ | --------------------------- |
| ID          | INT          | -                           |
| RecordIndex | TIMESTAMP    | -                           |
| Name        | VARCHAR(30)  | 이름                        |
| Score       | INT          | 점수                        |
| Ranking     | TINYINT      | 순위                        |
| Seat        | TINYINT      | 자리( 동:0 남:1 서:2 북:3 ) |
| Uma         | TINYINT      | 우마                        |
| Star        | TINYINT      | 별( 하네만: 1 )             |
| Perpect     | VARCHAR(30)  | 역만( 1\|2\|3\|4 )          |
| Deposit     | INT          | 공탁금                      |
| Link        | VARCHAR(150) | 패보                        |
| UpdateTime  | TIMESTAMP    | 언제 업데이트했는지         |
```
CREATE TABLE IndexRecord (
    ID            INT AUTO_INCREMENT PRIMARY KEY,
    RecordIndex   INT NOT NULL,
    Name          VARCHAR(30) NOT NULL,
    Score         INT DEFAULT 0,
    Ranking       TINYINT DEFAULT 0,
    Seat          TINYINT DEFAULT 0,
    Uma           TINYINT DEFAULT 0,
    Star          TINYINT DEFAULT 0,
    Perpect       VARCHAR(30) NOT NULL,
    Deposit       INT DEFAULT 0,
    Link          VARCHAR(150),
    UpdateTime    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARACTER SET UTF8;
```
```
DROP TABLE IndexRecord;
DELETE FROM IndexRecord;
ALTER TABLE IndexRecord AUTO_INCREMENT=1;
INSERT INTO 
    IndexRecord(RecordIndex, Name, Score, Ranking, Seat, Uma, Star, Perpect, Link, Deposit) 
    VALUES(0, "", 0, 0, 0, 0, 0, "", "", 0);
```

## 관리자 ID Database
| Name | Type         | 설명 |
| ---- | ------------ | ---- |
| ID   | VARCHAR(30)  | -    |
| PWD  | VARCHAR(150) | -    |
| SALT | VARCHAR(100) | -    |

```
CREATE TABLE Autho (
    ID    VARCHAR(30)  NOT NULL,
    PWD   VARCHAR(150) NOT NULL,
    SALT  VARCHAR(100) NOT NULL
) DEFAULT CHARACTER SET UTF8;

```

## 관리자 ID 접속시간 LOG
| Name | Type         | 설명 |
| ---- | ------------ | ---- |
| ID   | VARCHAR(30)  | -    |
| PWD  | VARCHAR(100) | -    |

```
CREATE TABLE AuthoLog (
    ID    VARCHAR(30) NOT NULL,
    PWD   VARCHAR(30) NOT NULL,
) DEFAULT CHARACTER SET UTF8;
```