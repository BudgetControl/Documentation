---
sidebar_position: 3
---

# Coding Standards

This document outlines the coding standards and best practices for contributing to BudgetControl.

## General Principles

### Code Quality
- Write clean, readable, and maintainable code
- Follow SOLID principles
- Use meaningful variable and function names
- Keep functions and classes small and focused
- Write self-documenting code

### Documentation
- Document all public APIs
- Include inline comments for complex logic
- Update documentation when changing functionality
- Write clear commit messages

## PHP Standards (Backend)

### PSR Standards
We follow PHP-FIG standards:
- **PSR-1**: Basic Coding Standard
- **PSR-2**: Coding Style Guide (deprecated, use PSR-12)
- **PSR-12**: Extended Coding Style Guide
- **PSR-4**: Autoloader

### Code Style

#### Class Structure
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Entry;
use App\Repositories\EntryRepository;
use Illuminate\Support\Collection;

/**
 * Service for handling entry operations
 */
final class EntryService
{
    public function __construct(
        private readonly EntryRepository $entryRepository
    ) {
    }

    public function createEntry(array $data): Entry
    {
        // Implementation
    }
}
```

#### Method Naming
```php
// Good
public function calculateTotalAmount(): float
public function findByWorkspaceId(string $workspaceId): Collection
public function isValidEntry(Entry $entry): bool

// Bad
public function calc(): float
public function get($id): Collection
public function check($entry): bool
```

#### Type Declarations
```php
// Always use type declarations
public function processEntries(array $entries): Collection
public function calculateSum(float $amount, int $quantity): float
public function isActive(): bool
```

### Laravel Specific

#### Controllers
```php
<?php

namespace App\Http\Controllers;

class EntryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $entries = $this->entryService->getPaginated(
            $request->get('page', 1),
            $request->get('per_page', 30)
        );

        return response()->json($entries);
    }

    public function store(StoreEntryRequest $request): JsonResponse
    {
        $entry = $this->entryService->create($request->validated());

        return response()->json($entry, 201);
    }
}
```

#### Models
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entry extends Model
{
    protected $fillable = [
        'amount',
        'note',
        'date_time',
        'account_id',
        'category_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date_time' => 'datetime',
        'confirmed' => 'boolean',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }
}
```

#### Validation
```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEntryRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric'],
            'note' => ['nullable', 'string', 'max:255'],
            'account_id' => ['required', 'exists:accounts,id'],
            'category_id' => ['required', 'exists:categories,id'],
        ];
    }
}
```

## JavaScript/Vue.js Standards (Frontend)

### Vue.js Component Structure
```vue
<template>
  <div class="entry-form">
    <form @submit.prevent="handleSubmit">
      <input
        v-model="form.amount"
        type="number"
        placeholder="Amount"
        required
      >
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : 'Save' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Entry } from '@/types/entry'

interface EntryForm {
  amount: number
  note: string
  accountId: string
}

// Props
defineProps<{
  entry?: Entry
}>()

// Emits
const emit = defineEmits<{
  submit: [entry: EntryForm]
}>()

// State
const isSubmitting = ref(false)
const form = reactive<EntryForm>({
  amount: 0,
  note: '',
  accountId: ''
})

// Methods
const handleSubmit = async (): Promise<void> => {
  isSubmitting.value = true
  
  try {
    emit('submit', { ...form })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.entry-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>
```

### TypeScript Standards
```typescript
// Types
interface Entry {
  uuid: string
  amount: number
  note?: string
  dateTime: Date
  confirmed: boolean
}

// API Service
class EntryService {
  private readonly baseUrl = '/api/entries'

  async getEntries(page = 1, perPage = 30): Promise<PaginatedResponse<Entry>> {
    const response = await fetch(`${this.baseUrl}?page=${page}&per_page=${perPage}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch entries')
    }
    
    return response.json()
  }

  async createEntry(data: CreateEntryRequest): Promise<Entry> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create entry')
    }
    
    return response.json()
  }
}
```

### Naming Conventions
```javascript
// Variables and functions: camelCase
const userBalance = 100
const calculateTotal = () => {}

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_ENTRIES_PER_PAGE = 50

// Components: PascalCase
// EntryForm.vue
// UserProfile.vue
// DashboardStats.vue
```

## Database Standards

### Migration Structure
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->decimal('amount', 10, 2);
            $table->text('note')->nullable();
            $table->timestamp('date_time');
            $table->boolean('confirmed')->default(true);
            $table->foreignId('account_id')->constrained();
            $table->foreignId('category_id')->constrained();
            $table->foreignId('workspace_id')->constrained();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['workspace_id', 'date_time']);
            $table->index(['account_id', 'confirmed']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entries');
    }
};
```

### Model Conventions
- Use singular table names
- Use `snake_case` for column names
- Always include `created_at`, `updated_at`
- Use `soft deletes` where appropriate
- Add proper indexes for performance

## API Standards

### RESTful Design
```
GET    /api/entries          # List entries
POST   /api/entries          # Create entry
GET    /api/entries/{id}     # Get specific entry
PUT    /api/entries/{id}     # Update entry
DELETE /api/entries/{id}     # Delete entry
```

### Response Format
```json
{
  "data": {
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "amount": -50.00,
    "note": "Coffee shop",
    "date_time": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "amount": ["The amount field is required."]
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "abc123"
  }
}
```

## Testing Standards

### Unit Tests
```php
<?php

namespace Tests\Unit\Services;

use App\Services\EntryService;
use App\Repositories\EntryRepository;
use PHPUnit\Framework\TestCase;
use Mockery;

class EntryServiceTest extends TestCase
{
    private EntryService $entryService;
    private EntryRepository $entryRepository;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->entryRepository = Mockery::mock(EntryRepository::class);
        $this->entryService = new EntryService($this->entryRepository);
    }

    public function test_can_create_entry(): void
    {
        // Arrange
        $data = [
            'amount' => -50.00,
            'note' => 'Test entry',
            'account_id' => 1,
        ];

        $this->entryRepository
            ->shouldReceive('create')
            ->once()
            ->with($data)
            ->andReturn(new Entry($data));

        // Act
        $result = $this->entryService->createEntry($data);

        // Assert
        $this->assertInstanceOf(Entry::class, $result);
        $this->assertEquals(-50.00, $result->amount);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
```

### Integration Tests
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EntryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_entry_via_api(): void
    {
        // Arrange
        $user = User::factory()->create();
        $workspace = Workspace::factory()->create(['user_id' => $user->id]);
        $account = Account::factory()->create(['workspace_id' => $workspace->id]);

        $data = [
            'amount' => -50.00,
            'note' => 'Test entry',
            'account_id' => $account->id,
        ];

        // Act
        $response = $this->actingAs($user)
            ->postJson('/api/entries', $data);

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
            'amount' => -50.00,
            'note' => 'Test entry',
        ]);
    }
}
```

## Git Standards

### Commit Messages
```
feat: add entry creation endpoint
fix: resolve balance calculation bug
docs: update API documentation
test: add unit tests for EntryService
refactor: extract common validation logic
style: fix code formatting issues
```

### Branch Naming
```
feature/add-budget-alerts
bugfix/fix-currency-conversion
hotfix/security-patch
release/v2.1.0
```

## Code Review Guidelines

### What to Look For
- Code follows established patterns
- Proper error handling
- Security considerations
- Performance implications
- Test coverage
- Documentation updates

### Review Checklist
- [ ] Code follows coding standards
- [ ] All tests pass
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Documentation updated
- [ ] Breaking changes noted

## Tools and Automation

### PHP Code Style
```bash
# Install PHP CS Fixer
composer require --dev friendsofphp/php-cs-fixer

# Run code style fixer
vendor/bin/php-cs-fixer fix
```

### ESLint/Prettier (Frontend)
```bash
# Install ESLint and Prettier
npm install --save-dev eslint prettier @vue/eslint-config-typescript

# Run linting
npm run lint
npm run lint:fix
```

### Pre-commit Hooks
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Configuration in .pre-commit-config.yaml
```

Following these standards ensures consistent, maintainable, and high-quality code across the BudgetControl project.
