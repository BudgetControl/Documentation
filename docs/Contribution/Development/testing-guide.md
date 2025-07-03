---
sidebar_position: 4
---

# Testing Guide

This guide covers testing strategies, tools, and best practices for BudgetControl development.

## Testing Philosophy

BudgetControl follows a comprehensive testing strategy:
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Feature Tests**: Test complete user workflows
- **API Tests**: Test HTTP endpoints and responses
- **End-to-End Tests**: Test the complete application flow

## Test Structure

### Directory Organization
```
tests/
├── Unit/
│   ├── Services/
│   ├── Models/
│   └── Helpers/
├── Feature/
│   ├── Api/
│   ├── Controllers/
│   └── Middleware/
├── Integration/
│   ├── Database/
│   └── External/
└── Support/
    ├── Factories/
    ├── Fixtures/
    └── Helpers/
```

## PHP/Laravel Testing

### Setting Up Tests

#### Test Database Configuration
```php
// phpunit.xml
<php>
    <env name="APP_ENV" value="testing"/>
    <env name="DB_CONNECTION" value="sqlite"/>
    <env name="DB_DATABASE" value=":memory:"/>
    <env name="CACHE_DRIVER" value="array"/>
    <env name="SESSION_DRIVER" value="array"/>
    <env name="QUEUE_DRIVER" value="sync"/>
</php>
```

#### Base Test Class
```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed base data
        $this->artisan('db:seed', ['--class' => 'TestDataSeeder']);
        
        // Set up authentication
        $this->actingAs($this->createTestUser());
    }

    protected function createTestUser(): User
    {
        return User::factory()->create([
            'email' => 'test@budgetcontrol.dev',
        ]);
    }
}
```

### Unit Testing

#### Service Layer Testing
```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\BudgetCalculationService;
use App\Models\Entry;
use App\Models\Budget;
use Mockery;

class BudgetCalculationServiceTest extends TestCase
{
    private BudgetCalculationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new BudgetCalculationService();
    }

    /** @test */
    public function it_calculates_budget_percentage_correctly(): void
    {
        // Arrange
        $budget = Budget::factory()->create(['amount' => 1000]);
        $entries = collect([
            Entry::factory()->make(['amount' => -300]),
            Entry::factory()->make(['amount' => -200]),
        ]);

        // Act
        $percentage = $this->service->calculateSpentPercentage($budget, $entries);

        // Assert
        $this->assertEquals(50.0, $percentage);
    }

    /** @test */
    public function it_handles_zero_budget_amount(): void
    {
        // Arrange
        $budget = Budget::factory()->create(['amount' => 0]);
        $entries = collect([Entry::factory()->make(['amount' => -100])]);

        // Act & Assert
        $this->expectException(InvalidArgumentException::class);
        $this->service->calculateSpentPercentage($budget, $entries);
    }
}
```

#### Model Testing
```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Entry;
use App\Models\Account;

class EntryTest extends TestCase
{
    /** @test */
    public function it_has_required_attributes(): void
    {
        $entry = Entry::factory()->create();

        $this->assertNotNull($entry->uuid);
        $this->assertNotNull($entry->amount);
        $this->assertNotNull($entry->date_time);
    }

    /** @test */
    public function it_belongs_to_an_account(): void
    {
        $account = Account::factory()->create();
        $entry = Entry::factory()->create(['account_id' => $account->id]);

        $this->assertInstanceOf(Account::class, $entry->account);
        $this->assertEquals($account->id, $entry->account->id);
    }

    /** @test */
    public function it_formats_amount_correctly(): void
    {
        $entry = Entry::factory()->create(['amount' => -123.456]);

        $this->assertEquals('-123.46', $entry->formatted_amount);
    }

    /** @test */
    public function it_scopes_by_workspace(): void
    {
        $workspace1 = Workspace::factory()->create();
        $workspace2 = Workspace::factory()->create();
        
        Entry::factory()->count(3)->create(['workspace_id' => $workspace1->id]);
        Entry::factory()->count(2)->create(['workspace_id' => $workspace2->id]);

        $entries = Entry::forWorkspace($workspace1->id)->get();

        $this->assertCount(3, $entries);
    }
}
```

### Feature Testing

#### API Endpoint Testing
```php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\Entry;
use App\Models\Account;

class EntryControllerTest extends TestCase
{
    /** @test */
    public function it_can_list_entries_with_pagination(): void
    {
        // Arrange
        Entry::factory()->count(50)->create();

        // Act
        $response = $this->getJson('/api/entries?page=1&per_page=20');

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'uuid',
                        'amount',
                        'note',
                        'date_time',
                        'account',
                    ]
                ],
                'meta' => [
                    'current_page',
                    'per_page',
                    'total',
                ]
            ])
            ->assertJsonCount(20, 'data');
    }

    /** @test */
    public function it_can_create_an_entry(): void
    {
        // Arrange
        $account = Account::factory()->create();
        $category = Category::factory()->create();
        
        $data = [
            'amount' => -50.99,
            'note' => 'Coffee shop purchase',
            'account_id' => $account->id,
            'category_id' => $category->id,
            'date_time' => '2024-01-15T10:30:00Z',
        ];

        // Act
        $response = $this->postJson('/api/entries', $data);

        // Assert
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'uuid',
                    'amount',
                    'note',
                ]
            ]);

        $this->assertDatabaseHas('entries', [
            'amount' => -50.99,
            'note' => 'Coffee shop purchase',
        ]);
    }

    /** @test */
    public function it_validates_required_fields_on_creation(): void
    {
        // Act
        $response = $this->postJson('/api/entries', []);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'amount',
                'account_id',
                'category_id',
            ]);
    }

    /** @test */
    public function it_can_filter_entries_by_account(): void
    {
        // Arrange
        $account1 = Account::factory()->create();
        $account2 = Account::factory()->create();
        
        Entry::factory()->count(3)->create(['account_id' => $account1->id]);
        Entry::factory()->count(2)->create(['account_id' => $account2->id]);

        // Act
        $response = $this->getJson("/api/entries?filters[account_id]={$account1->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }
}
```

#### Authentication Testing
```php
<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    /** @test */
    public function it_requires_authentication_for_protected_routes(): void
    {
        $response = $this->getJson('/api/entries');

        $response->assertStatus(401);
    }

    /** @test */
    public function it_accepts_valid_bearer_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->getJson('/api/entries');

        $response->assertStatus(200);
    }

    /** @test */
    public function it_requires_workspace_header(): void
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->getJson('/api/entries');

        $response->assertStatus(400)
            ->assertJson([
                'error' => 'Workspace header required'
            ]);
    }
}
```

### Database Testing

#### Migration Testing
```php
<?php

namespace Tests\Integration\Database;

use Tests\TestCase;
use Illuminate\Support\Facades\Schema;

class MigrationTest extends TestCase
{
    /** @test */
    public function entries_table_has_expected_columns(): void
    {
        $this->assertTrue(Schema::hasTable('entries'));
        
        $columns = [
            'id', 'uuid', 'amount', 'note', 'date_time',
            'account_id', 'category_id', 'workspace_id',
            'created_at', 'updated_at', 'deleted_at'
        ];

        foreach ($columns as $column) {
            $this->assertTrue(
                Schema::hasColumn('entries', $column),
                "Column {$column} does not exist in entries table"
            );
        }
    }

    /** @test */
    public function entries_table_has_proper_indexes(): void
    {
        $indexes = $this->getTableIndexes('entries');
        
        $this->assertContains('entries_workspace_id_date_time_index', $indexes);
        $this->assertContains('entries_account_id_confirmed_index', $indexes);
    }

    private function getTableIndexes(string $table): array
    {
        return DB::select("
            SELECT indexname 
            FROM pg_indexes 
            WHERE tablename = ?
        ", [$table]);
    }
}
```

## Frontend Testing (Vue.js)

### Component Testing with Vue Test Utils
```typescript
// tests/components/EntryForm.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import EntryForm from '@/components/EntryForm.vue'

describe('EntryForm', () => {
  it('renders form fields correctly', () => {
    const wrapper = mount(EntryForm)

    expect(wrapper.find('input[name="amount"]').exists()).toBe(true)
    expect(wrapper.find('input[name="note"]').exists()).toBe(true)
    expect(wrapper.find('select[name="account"]').exists()).toBe(true)
  })

  it('emits submit event with form data', async () => {
    const wrapper = mount(EntryForm)
    
    await wrapper.find('input[name="amount"]').setValue('-50.99')
    await wrapper.find('input[name="note"]').setValue('Coffee')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0]).toEqual([{
      amount: -50.99,
      note: 'Coffee',
      accountId: ''
    }])
  })

  it('validates required fields', async () => {
    const wrapper = mount(EntryForm)
    
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error-message').text()).toContain('Amount is required')
  })

  it('disables submit button when loading', async () => {
    const wrapper = mount(EntryForm, {
      props: { isLoading: true }
    })

    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
})
```

### Store/Composable Testing
```typescript
// tests/stores/entries.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEntriesStore } from '@/stores/entries'
import * as entryService from '@/services/entryService'

vi.mock('@/services/entryService')

describe('Entries Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads entries successfully', async () => {
    const mockEntries = [
      { uuid: '1', amount: -50, note: 'Coffee' },
      { uuid: '2', amount: -100, note: 'Lunch' }
    ]

    vi.mocked(entryService.getEntries).mockResolvedValue({
      data: mockEntries,
      meta: { total: 2 }
    })

    const store = useEntriesStore()
    await store.loadEntries()

    expect(store.entries).toEqual(mockEntries)
    expect(store.isLoading).toBe(false)
  })

  it('handles errors when loading entries', async () => {
    vi.mocked(entryService.getEntries).mockRejectedValue(
      new Error('Network error')
    )

    const store = useEntriesStore()
    await store.loadEntries()

    expect(store.entries).toEqual([])
    expect(store.error).toBe('Failed to load entries')
  })

  it('adds new entry to store', async () => {
    const newEntry = { uuid: '3', amount: -25, note: 'Snack' }
    
    vi.mocked(entryService.createEntry).mockResolvedValue(newEntry)

    const store = useEntriesStore()
    await store.createEntry({ amount: -25, note: 'Snack' })

    expect(store.entries).toContain(newEntry)
  })
})
```

## API Testing with Postman/Newman

### Automated API Testing
```javascript
// postman-tests/entry-endpoints.js
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has correct structure", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.be.an('array');
});

pm.test("Entry has required fields", function () {
    const jsonData = pm.response.json();
    const entry = jsonData.data[0];
    
    pm.expect(entry).to.have.property('uuid');
    pm.expect(entry).to.have.property('amount');
    pm.expect(entry).to.have.property('date_time');
});

pm.test("Amount is properly formatted", function () {
    const jsonData = pm.response.json();
    const entry = jsonData.data[0];
    
    pm.expect(entry.amount).to.be.a('number');
    pm.expect(entry.amount.toString()).to.match(/^-?\d+(\.\d{1,2})?$/);
});
```

### Running API Tests
```bash
# Install Newman globally
npm install -g newman

# Run Postman collection
newman run postman-collections/BudgetControl-API.postman_collection.json \
  --environment postman-environments/dev.postman_environment.json \
  --reporters html,cli \
  --reporter-html-export test-results.html
```

## Performance Testing

### Load Testing with Artillery
```yaml
# artillery-config.yml
config:
  target: 'https://dev.app.budgetcontrol.cloud'
  phases:
    - duration: 60
      arrivalRate: 10
  headers:
    Authorization: 'Bearer {{ $processEnvironment.AUTH_TOKEN }}'
    X-Bc-Token: '{{ $processEnvironment.BC_TOKEN }}'
    X-Bc-Ws: '{{ $processEnvironment.BC_WS }}'

scenarios:
  - name: 'Get entries'
    weight: 70
    flow:
      - get:
          url: '/api/entries?page={{ $randomInt(1, 10) }}'
  
  - name: 'Create entry'
    weight: 30
    flow:
      - post:
          url: '/api/entries'
          json:
            amount: '{{ $randomNumber(-500, -1) }}'
            note: 'Load test entry'
            account_id: 1
            category_id: 1
```

### Database Performance Testing
```php
<?php

namespace Tests\Performance;

use Tests\TestCase;
use App\Models\Entry;

class DatabasePerformanceTest extends TestCase
{
    /** @test */
    public function entries_query_performs_well_with_large_dataset(): void
    {
        // Arrange: Create large dataset
        Entry::factory()->count(10000)->create();

        // Act: Measure query time
        $start = microtime(true);
        
        $entries = Entry::with(['account', 'category'])
            ->where('date_time', '>=', now()->subMonth())
            ->paginate(50);
            
        $duration = microtime(true) - $start;

        // Assert: Query should complete within reasonable time
        $this->assertLessThan(1.0, $duration, 'Query took too long');
        $this->assertCount(50, $entries->items());
    }
}
```

## Test Data Management

### Factories
```php
<?php

namespace Database\Factories;

use App\Models\Entry;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntryFactory extends Factory
{
    protected $model = Entry::class;

    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid(),
            'amount' => $this->faker->randomFloat(2, -500, -1),
            'note' => $this->faker->sentence(),
            'date_time' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'confirmed' => $this->faker->boolean(90),
            'account_id' => Account::factory(),
            'category_id' => Category::factory(),
            'workspace_id' => Workspace::factory(),
        ];
    }

    public function expense(): static
    {
        return $this->state(fn () => [
            'amount' => $this->faker->randomFloat(2, -500, -1),
            'type' => 'expense',
        ]);
    }

    public function income(): static
    {
        return $this->state(fn () => [
            'amount' => $this->faker->randomFloat(2, 1, 5000),
            'type' => 'income',
        ]);
    }
}
```

### Test Seeders
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Workspace;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'email' => 'test@budgetcontrol.dev',
        ]);

        $workspace = Workspace::factory()->create([
            'user_id' => $user->id,
            'name' => 'Test Workspace',
        ]);

        // Create test accounts, categories, etc.
        Account::factory()->count(3)->create([
            'workspace_id' => $workspace->id,
        ]);

        Category::factory()->count(10)->create();
    }
}
```

## CI/CD Testing Pipeline

### GitHub Actions Configuration
```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: budget_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: 8.2
        extensions: dom, curl, libxml, mbstring, zip, pdo, pgsql
        coverage: xdebug

    - name: Install dependencies
      run: composer install --prefer-dist --no-progress

    - name: Setup environment
      run: |
        cp .env.testing .env
        php artisan key:generate

    - name: Run migrations
      run: php artisan migrate

    - name: Run tests
      run: php artisan test --coverage --min=80
```

## Best Practices

### Test Organization
- Group related tests in the same file
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### Performance
- Use database transactions for faster tests
- Mock external services
- Use in-memory databases for unit tests
- Parallel test execution where possible

### Maintenance
- Regular test review and cleanup
- Update tests with code changes
- Monitor test coverage metrics
- Remove obsolete tests

### Documentation
- Comment complex test scenarios
- Document test data setup
- Explain non-obvious assertions
- Keep README updated with test instructions

This comprehensive testing approach ensures BudgetControl maintains high quality and reliability across all components.
