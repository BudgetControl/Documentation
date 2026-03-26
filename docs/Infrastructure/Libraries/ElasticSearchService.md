# ElasticSearchService

ElasticSearchService is a PHP package designed to provide simple and efficient integration with Elasticsearch for BudgetControl applications.

## Features

- **Easy Integration**: The package offers a simple and straightforward integration process, allowing developers to quickly incorporate Elasticsearch search and indexing capabilities into their applications.

- **Flexible Configuration**: With ElasticSearchService, you have the flexibility to configure various Elasticsearch settings, such as host, port, authentication credentials, and indexing options.

- **Transaction Management**: The package supports indexing and searching financial transactions with support for aggregations and advanced statistics.

- **Natural Language Search**: Implements advanced search capabilities that allow querying data using natural language.

## Main Components

### Client
- **ElasticSearchClient**: Main client for communicating with Elasticsearch

### Services
- **ElasticSearchService**: Main service for managing Elasticsearch operations
- **Indexer**: Handles document indexing
- **Search**: Provides advanced search functionality
- **NaturalLanguageSearch**: Implements natural language search
- **FinanceStats**: Manages financial statistics

### Entities
- **TransactionInterface**: Interface for transactions
- **EntryTransaction**: Management of entry transactions
- **WalletTransaction**: Management of wallet transactions

## Getting Started

Install the package using Composer:

```bash
composer require budgetcontrol/elasticsearch-service
```

## Example

```php
use BudgetControl\ElasticSearchService\Services\ElasticSearchService;
use BudgetControl\ElasticSearchService\Services\Clients\ElasticSearchClient;

// Initialize the client
$client = new ElasticSearchClient($host, $port, $username, $password);
$elasticService = new ElasticSearchService($client);

// Index a transaction
$transaction = new EntryTransaction($data);
$elasticService->indexTransaction($transaction);

// Search transactions
$results = $elasticService->searchTransactions($query, $filters);
```

[GitHub Link](https://github.com/BudgetControl/ElasticSearchService)
