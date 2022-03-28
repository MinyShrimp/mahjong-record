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
| Time       | TIMESTAMP   | 언제 썼는지         |
| Title      | VARCHAR(30) | 어디에 썼는지       |
| Money      | INT         | 얼마나 썼는지       |
| Type       | TINYINT     | 수입인지 지출인지   |
| UpdateTime | TIMESTAMP   | 언제 업데이트했는지 |

```
CREATE TABLE MahjongRecord (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name  VARCHAR(30) NOT NULL,
    Score INT NOT NULL,
    Count INT NOT NULL,
    rank_1 INT NOT NULL,
    rank_2 INT NOT NULL,
    UpdateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARACTER SET UTF8;
```
```
DROP TABLE MahjongRecord;
ALTER TABLE MahjongRecord AUTO_INCREMENT=1;
INSERT INTO MahjongRecord(Date, Title, Money, Type) VALUES(now(), "", 0, 0);
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
    IndexRecord(RecordIndex, Name, Score, Ranking, Seat, Uma, Star) 
    VALUES(0, "", 0, 0, 0, 0, 0);
```