# WR505 - Movie API - Maximilien LEMOINE - 2024

### Prérequis

- [Node.js](https://nodejs.org/en/)
- [Npm](https://www.npmjs.com/get-npm)
- Projet Backend [WR506](https://github.com/maximilienlemoine/WR506-MovieApp)

### Installation

1. Cloner le projet
2. Installer les dépendances
    ```bash
    npm install
    ```
3. Créer le fichier .env.local et renseigner les variables d'environnement
    ```bash
    cp .env .env.local
    ```
4. Renseigner les variables suivantes :
    ```dotenv
    VITE_SERVER_API_URL #(url de l'api)
    ```
5. Lancer le serveur
- Development
```bash
npm run dev
```
- Production
```bash
npm run build
```

Les identifiants par défaut pour se connecter a l'application sont les suivants :
```
Admin:
    email: user1@example.com
    password: password
User:
    email: user2@example.com [user2-user6]
    password: password
```
