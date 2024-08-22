---
sidebar_position: 1
---

# The basics

![version](https://img.shields.io/badge/version-2.2.2-blue.svg) ![license](https://img.shields.io/badge/license-AGPL-blue.svg) <a 
href="https://github.com/budgetcontrol/services/issues?q=is%3Aopen+is%3Aissue" target="_blank">![GitHub issues](https://img.shields.io/github/issues/budgetcontrol/Services)
</a> <a href="https://github.com/budgetcontrol/services/issues?q=is%3Aissue+is%3Aclosed" target="_blank">![GitHub closed issues](https://img.shields.io/github/issues-closed/budgetcontrol/Services?color=green)
</a> <a href="https://github.com/budgetcontrol/services/issues?q=is%3Aissue+is%3Aopen+label%3Abug" target="_blank">![GitHub issues by-label](https://img.shields.io/github/issues/budgetcontrol/Services/bug?color=red)
</a><a href="https://discord.gg/TtMTeUbSpW" target="_blank">![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg)</a>

BudgetControl is an open-source project designed to provide a comprehensive solution for managing personal and organizational finances. The application is built using PHP 8.1^ and Vue.js 3, leveraging modern web technologies to deliver a fast, scalable, and user-friendly experience.

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
- Libs_BcConnector: Sdk package, Budget Control connector API
- Schema-Registry-Service: An Schema Registry is a centralized service that manages and distributes database schema definitions
- SeedsTestLibs: Library with seeds test and migration for unit test
- Library: This repository contains a collection of common definitions and utilities for all microservices within the Finance Budget Control application. Designed to ensure consistency and code reuse

### Gateway
The application utilizes a PHP Laravel 11 Gateway as the entry point, serving as the central hub that coordinates communication between the various microservices. This gateway ensures secure and efficient routing of requests, as well as providing additional layers of functionality such as API management, authentication, and rate limiting.

### Progressive Web Application (PWA)
BudgetControl is designed as a Progressive Web Application (PWA), offering a seamless and responsive user experience. Built with Vue.js 3, the application combines the best features of web and mobile applications, including offline access, push notifications, and the ability to be installed on a user's device like a native app. This ensures that users can manage their finances anytime, anywhere, even without a constant internet connection.

## Getting Started

To get started with BudgetControl, follow the steps below to set up your development or production environment.

### Step 1: Clone the Repository
Begin by cloning the base repository from GitHub. This repository contains the core files and configurations needed to run BudgetControl.

```
git clone https://github.com/BudgetControl/Core
```

### Step 2: Run the Installation Script
Once you have cloned the repository, navigate to the project directory and run the install.sh script. This script will automatically set up the necessary dependencies and configure the environment based on your chosen setup.

#### Development Environment Setup
If you are setting up a development environment, you have two options based on whether you want to run the Progressive Web Application (PWA) using Apache or Node.js.

1 Development Environment with PWA on Apache:
```
./install.sh --end dev --pwa apache
```
This command configures the environment for development with the PWA served by Apache.

2 Development Environment with PWA on Node.js:
```
./install.sh --end dev --pwa node
```
This command sets up the development environment with the PWA served by Node.js.

3. Production Environment Setup
```
./install.sh
```
For setting up a production environment, simply run the installation script without any additional parameters. This will configure the application with the appropriate production settings.

### What you'll need

Before getting started with BudgetControl, make sure you have the following prerequisites installed on your system:

Docker: BudgetControl uses Docker for containerization, ensuring a consistent development and production environment. If you don’t already have Docker installed, you can download it from the official Docker website and follow the installation instructions for your operating system.

## Start your site

Enjoy on http://localhost
