## 참고 링크
* [기본 문법](http://www.tcpschool.com/mysql/mysql_basic_syntax)

## 설치
* brew install mysql@5.7 mysql-client@5.7

## 도커
* docker run --platform linux/amd64 -p 3306:3306 --name mysql-container -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=Account -e MYSQL_PASSWORD=root -d mysql:5.7

## 빌드
* docker-compose up -d

## 구조
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
ALTER TABLE UserRecord AUTO_INCREMENT=1;
SELECT ID, Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4 FROM UserRecord;

INSERT INTO 
    UserRecord(Name, Uma, Score, MaxScore, Star, Count, Rank_1, Rank_2, Rank_3, Rank_4) 
    VALUES(      "",   0,     0,        0,    0,     0,      0,      0,      0,      0);

UPDATE UserRecord
    SET Uma="", Score=0, MaxScore=0, Star=0, Count=0, Rank_1=0, Rank_2=0, Rank_3=0, Rank_4=0
    WHERE ID = id;
```

## 구조
| Name        | Type        | 설명                        |
| ----------- | ----------- | --------------------------- |
| ID          | INT         | -                           |
| RecordIndex | TIMESTAMP   | -                           |
| Name        | VARCHAR(30) | 이름                        |
| Score       | INT         | 점수                        |
| Ranking     | TINYINT     | 순위                        |
| Seat        | TINYINT     | 자리( 동:0 남:1 서:2 북:3 ) |
| Uma         | TINYINT     | 우마                        |
| Star        | TINYINT     | 별( 하네만: 1 )             |
| Perpect     | VARCHAR(30) | 역만( 1\|2\|3\|4 )          |
| Deposit     | INT         | 공탁금                      |
| UpdateTime  | TIMESTAMP   | 언제 업데이트했는지         |

```
CREATE TABLE IndexRecord (
    ID            INT AUTO_INCREMENT PRIMARY KEY,
    RecordIndex   INT NOT NULL,
    Name          VARCHAR(30) NOT NULL,
    Score         INT NOT NULL,
    Ranking       TINYINT NOT NULL,
    Seat          TINYINT NOT NULL,
    Uma           TINYINT NOT NULL,
    Star          TINYINT NOT NULL,
    Perpect       VARCHAR(30) NOT NULL,
    UpdateTime    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARACTER SET UTF8;
```
```
DROP TABLE IndexRecord;
ALTER TABLE IndexRecord AUTO_INCREMENT=1;
INSERT INTO 
    IndexRecord(RecordIndex, Name, Score, Ranking, Seat, Uma, Star, Perpect, Deposit) 
    VALUES(0, "", 0, 0, 0, 0, 0, "", 0);
```