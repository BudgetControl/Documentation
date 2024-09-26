---
sidebar_position: 1
---

# The basics

![license](https://img.shields.io/badge/license-AGPL-blue.svg) <a 
href="https://github.com/budgetcontrol/budgetcontrol/issues?q=is%3Aopen+is%3Aissue" target="_blank">![GitHub issues](https://img.shields.io/github/issues/budgetcontrol/budgetcontrol)
</a><a href="https://github.com/budgetcontrol/budgetcontrol/issues?q=is%3Aissue+is%3Aopen+label%3Abug" target="_blank">![GitHub issues by-label](https://img.shields.io/github/issues/budgetcontrol/budgetcontrol/bug?color=red)
</a><a href="https://discord.gg/TtMTeUbSpW" target="_blank">![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg)</a>

BudgetControl is an open-source project designed to provide a comprehensive solution for managing personal and organizational finances. The application is built using PHP 8.2^ and Vue.js 3, leveraging modern web technologies to deliver a fast, scalable, and user-friendly experience.

### Microservice Infrastructure
BudgetControl is architected using a microservices infrastructure, which ensures that each component of the application is modular, scalable, and can be developed and deployed independently. The core services that make up the BudgetControl application include:

- Core: The backbone of the application, managing essential functionalities and providing the foundational services that other microservices rely on.
- Entries: Handles the creation, modification, and management of financial entries, such as income and expenses.
- Wallets: Manages different wallets or accounts, allowing users to track balances and transactions across multiple financial sources.
- Budgets: Provides tools for creating and maintaining budgets, helping users plan and control their spending.
- CommandJob: Manages background jobs and scheduled tasks, ensuring that operations like data synchronization and periodic updates run smoothly.
- SearchEngine: Powers the search functionality within the application, enabling users to quickly find transactions, entries, and other data.
- Stats: Generates and displays statistical data and reports, providing users with insights into their financial activities and trends.
- Workspace: Organizes user activities and projects within the application, offering a structured environment for managing finances.
- Authentication: Handles user authentication and authorization, ensuring secure access to the application.
- Labels: Manages labels and tags, allowing users to categorize and organize their financial data more effectively.

### Developed libraries
- Libs_BcConnector: Budget Control connector API for integrating with external systems.
- Schema-Registry-Service: Ensures consistency and compatibility between microservices by managing shared schema definitions.
- SeedsTestLibs: Provides pre-configured data and migration scripts to facilitate unit testing.
- Library: A foundational component of the Finance Budget Control application, promoting code reusability and maintainability.
- MailerService: Enables effective communication with users by sending customized email notifications.

### Gateway
The application utilizes a PHP Laravel 11 Gateway as the entry point, serving as the central hub that coordinates communication between the various microservices. This gateway ensures secure and efficient routing of requests, as well as providing additional layers of functionality such as API management, authentication, and rate limiting.

### Progressive Web Application (PWA)
BudgetControl is designed as a Progressive Web Application (PWA), offering a seamless and responsive user experience. Built with Vue.js 3, the application combines the best features of web and mobile applications, including offline access, push notifications, and the ability to be installed on a user's device like a native app. This ensures that users can manage their finances anytime, anywhere, even without a constant internet connection.

## Getting Started

To get started with BudgetControl, follow the steps below to set up your development or production environment.

### Before install
Before install modify your etc host adding the following domain ( nano /etc/hosts ---> 127.0.0.1 dev.app.budgetcontrol.lan )
Before run the script, check your environment file is with the right variables

### Step 1: Clone the Repository
Begin by cloning the base repository from GitHub. This repository contains the core files and configurations needed to run BudgetControl.

```
git clone git@github.com:BudgetControl/BudgetControl.git
```

### Step 2: Run the Installation Script
Once you have cloned the repository, navigate to the project directory and run the install.sh script. This script will automatically set up the necessary dependencies and configure the environment based on your chosen setup.

```
cd BudgetControl
chmod 700 install.sh
./install.sh
```

### Step 3: Run Front End Application
* clone Front End application ( git clone git@github.com:BudgetControl/Pwa.git )
* lunch docker compose ( docker-compose up -d )

### What you'll need

Before getting started with BudgetControl, make sure you have the following prerequisites installed on your system:

Docker: BudgetControl uses Docker for containerization, ensuring a consistent development and production environment. If you don’t already have Docker installed, you can download it from the official Docker website and follow the installation instructions for your operating system.

## Start your site

Enjoy on https://dev.app.budgetcontrol.lan
