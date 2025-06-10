# Nest API Starter

---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeORM-E83524?style=for-the-badge&logo=typeorm&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
  <img src="https://img.shields.io/badge/Winston-000000?style=for-the-badge&logo=npm&logoColor=white&label=Winston" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
</p>

---

## 🧱 Stack technique

- **Langage** : TypeScript
- **Framework** : [NestJS](https://nestjs.com/)
- **Base de données** : PostgreSQL
- **ORM** : TypeORM
- **Conteneurisation** : Docker + Docker Compose
- **Architecture** : Architecture modulaire

---

## 🚀 Démarrage rapide

### 1. Cloner le dépôt

```bash
git clone https://github.com/bradlab/robassime-api.git
cd robassime-api
```

### 2. Installer les dépendances

#### Avec npm :
```bash
npm install
```

#### Avec yarn :
```bash
yarn install
```

---

### 3. Configurer les variables d’environnement

Crée un fichier `.env` à la racine du projet en t’inspirant du fichier `.env.example` :

```env
# Exemple de configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=robassime
PORT=3000
```

---

### 4. Lancer l’application en mode développement

#### Avec npm :
```bash
npm run start:dev
```

#### Avec yarn :
```bash
yarn start:dev
```

L’API sera accessible par défaut sur [http://localhost:3000](http://localhost:3000)

---

## 🐳 Utilisation avec Docker

### 1. Lancer l’environnement complet

```bash
docker-compose up --build
```

Cela démarre :
- L’API NestJS
- La base de données PostgreSQL

---

### 2. Arrêter les conteneurs

```bash
docker-compose down
```

---

## 📁 Structure du projet

```
├── .gitignore                      # Fichiers à ignorer par Git
├── .husky/                         # Hooks Git (ex. : pre-commit)
├── .github/
│   └── workflows/                  # Fichiers de configuration GitHub Actions (CI/CD)
├── commitlint.config.cjs           # Configuration pour le lint des messages de commit
├── docker-compose.yml              # Configuration multi-conteneurs Docker (API + DB)
├── Dockerfile                      # Image Docker de l'application
├── jest.config.json                # Configuration de Jest (tests unitaires)
├── nest-cli.json                   # Configuration spécifique à NestJS CLI
├── package.json                    # Dépendances NPM et scripts de projet
├── releaserc.json                  # Configuration de Semantic Release
├── tsconfig.json                   # Configuration du compilateur TypeScript
├── yarn.lock                       # Verrouillage des versions Yarn
└── src/                  # Code source

      └───util
```

---

## 🛠️ Scripts utiles

| Commande                        | npm                       | yarn                     |
|---------------------------------|---------------------------|--------------------------|
| Start the project               | `npm run start`           | `yarn start`             |
| Development mode                | `npm run start:dev`       | `yarn start:dev`         |
| Compiler                        | `npm run build`           | `yarn build`             |
| Lint                            | `npm run lint`            | `yarn lint`              |
| Tests unitaires                 | `npm run test`            | `yarn test`              |
| Tests en mode watch             | `npm run test:watch`      | `yarn test:watch`        |
| Typescript check                | `npx tsc`                                            |
| Husky Hooks                     | `npm run init:hooks`      | `yarn init:hooks`        |

---

## 🧪 Tests

#### Avec npm :
```bash
npm run test
```

#### Avec yarn :
```bash
yarn test
```

---

## 🧾 Migrations TypeORM

#### Create a migration :

```bash
npm run typeorm migration:create -- -n migratinName
# ou
yarn typeorm migration:create -n migratinName
```
#### Execute  migrations :

```bash
npm run typeorm migration:run
# ou
yarn typeorm migration:run
```

#### Rollback the migration :

```bash
npm run typeorm migration:revert
# ou
yarn typeorm migration:revert
```

## 📫 Contact

For any questions or contributions :

- Author : **bradlab**
- Email : `matbradiouf@gmail.com`
- GitHub : [https://github.com/bradlab](https://github.com/bradlab)

---

## 📝 Licence

This project is licensed under the **MIT** license. See the `LICENSE` file for more information.
