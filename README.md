# IsBigint

This a temporary fix for missing `@IsBigint` decorator from `class-validator` package.

The decorator works the same ways as the `@IsNumber` decorator from the same package.

This package becomes obsolete when the `@IsBigint` decorator is added to the `class-validator` package.

Please follow this [pull request](https://github.com/typestack/class-validator/pull/2506) on the `class-validator` repository.

### Installation

```bash
npm install @kilbergr/is-bigint class-validator
```

### Usage

```typescript
import { IsBigint } from '@kilbergr/is-bigint';

class MyClass {
  @IsBigint()
  myField: bigint;
}
```