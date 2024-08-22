---
sidebar_position: 3
---

## Progressive Web Application (PWA) Overview
BudgetControl is developed as a Progressive Web Application (PWA) using Vue.js 3, which provides a modern and responsive user experience. The application is built upon a fork of the Vue Notus project available on [GitHub](https://github.com/creativetimofficial/vue-notus), which serves as a foundational framework for the frontend interface.

### Key Features:
- Modern User Experience: Leveraging Vue.js 3, BudgetControl offers a dynamic and interactive user interface that ensures a seamless experience across various devices and screen sizes.
- Progressive Enhancement: As a PWA, BudgetControl provides features such as offline access, push notifications, and the ability to install the app on a user's device, mimicking the experience of a native application.
- Development Environment:
Within the BudgetControl repository, you will find two Docker Compose configurations to support different development environments:

#### Apache Development Environment:

```
docker-compose -f docker-compose.apache.yml up -d
```
This configuration sets up the application with Apache, allowing you to develop and test the PWA with an Apache server.

#### Node.js Development Environment:

```
docker-compose -f docker-compose.yml up -d
```
This configuration sets up the application with Node.js, providing an alternative environment for development and testing.

Each Docker Compose file ensures that the development environment is consistent and easily reproducible, whether you prefer to use Apache or Node.js.

For more information on setting up and running the PWA, refer to the repository documentation and the respective Docker Compose files.

[GitHub Link](https://github.com/BudgetControl/Pwa)