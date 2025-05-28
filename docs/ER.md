erDiagram
  User {
    int id PK
    string name
    string email
    string firebaseUid
    string bio
  }
  Portfolio {
    int id PK
    string title
    string description
    int userId FK
  }
  Skill {
    int id PK
    string name
    string logoUrl
    int userId FK
  }
  Contact {
    int id PK
    string message
    string email
    int userId FK
  }
  Image {
    int id PK
    string url
    int portfolioId FK
  }

  User ||--o{ Portfolio : ""
  User ||--o{ Skill : ""
  User ||--o{ Contact : ""
  Portfolio ||--o{ Image : ""
