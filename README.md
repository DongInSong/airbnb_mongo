# Express and MongoDB Project - airbnb

Express.js와 MongoDB를 사용하여 구축된 에어비앤비(Airbnb)와 유사한 백엔드 애플리케이션

## 코드 구조
-   `server.js`: Express 서버 설정 및 데이터베이스 연결
-   `client/`: CLI 클라이언트 코드
    -   `client.js`
-   `faker/`: 더미 데이터 생성
    -   `faker.js`
    -   `houseName`: 더미 숙소 이름
-   `models/`: Mongoose 스키마 및 모델 정의
    -   `guest.js`: 게스트 모델 정의
    -   `house.js`: 숙소 모델 정의
    -   `reservation.js`: 예약 모델 정의
    -   `review.js`: 리뷰 모델 정의
    -   `index.js`: 모든 모델을 내보냄
-   `routers/`: 컨트롤러 로직
    -   `guestController.js`: 게스트 관련 API 라우트 및 로직
    -   `houseController.js`: 숙소 관련 API 라우트 및 로직
    -   `reservationController.js`: 예약 관련 API 라우트 및 로직
    -   `reviewController.js`: 리뷰 관련 API 라우트 및 로직
-   `utils/`: 재사용 유틸리티 함수
    -   `calender.js`: 달력 관련 로직

## 설치 및 실행

```bash
npm install
```

### 2. MongoDB 설정

`server.js` - `DB_URI` 수정

```javascript
const DB_URI = "mongodb://127.0.0.1:27017/testdb";
```

### 3. 서버 실행

```bash
npm run devstart
```

### 4. 클라이언트 실행

```bash
npm run client
```
