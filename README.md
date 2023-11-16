[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/snPWRHYg)

# Examenopdracht Front-end Web Development / Web Services

- Student: Brecht Vandekerckhove
- Studentennummer: 201102978
- E-mailadres: <mailto:brecht.vandekerckhove@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

Voor gebruikers van [Chocolatey](https://chocolatey.org/):
```powershell
choco install nodejs -y
choco install yarn -y
choco install mysql -y
choco install mysql.workbench -y
```


## Opstarten

- Maak een `.env`  bestand aan in de root met onderstaande code. 
Pas username, password, localhost en poortnummer aan jouw lokale instellingen.
```ini
`NODE_ENV=development`  
`DATABASE_URL="mysql://username:password@localhost:3306/midnightmeals`
```
- Installeer alle dependencies: `yarn`  
- Seed de database: `yarn prisma db seed`  
- Start de development server: `yarn start`  


## Testen

- Maak een `.env.test` bestand aan in de root met onderstaande code  
```ini
NODE_ENV=test  
```  
- Installeer alle dependencies: `yarn`
- Start de development server: `yarn test`
- Coverage nakijken: `yarn test:coverage`

