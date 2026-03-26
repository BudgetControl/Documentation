# LibsCryptable

LibsCryptable is a PHP library designed to generate and keep your data secure. It provides a `Crypt` trait that can be used in any class to easily encrypt and decrypt data.

## Getting Started

Install the library package using Composer:

```bash
composer require budgetcontrol/libs-cryptable
```

## Example

You can use the `Crypt` trait in your class:

```php
class Example {

    use Crypt;

    public function test() {
        $this->key = 'yourkey';
        $foo = 'foo';
        return $this->encrypt($foo);
    }

}
```

[GitHub Link](https://github.com/BudgetControl/LibsCryptable)
