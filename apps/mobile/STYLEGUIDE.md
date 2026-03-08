# Style Guide

## Component props

Do not destructure props on function header. Do it on function body.

```typescript
// ✅ Good
function Component(props: Props) {
    const { prop1, prop2, prop3 } = props
    return (...)
}

// ❌ Bad
function Component({ prop1, prop2, prop3 }: Props) {
    return (...)
}
```

It's fine to define props type inline:

```typescript
// ✅ Fine
function Component(props: { prop1: string, prop2: number }) {
    const { prop1, prop2 } = props
    return (...)
}

// ❌ Bad
function Component({ prop1, prop2 }: { prop1: string, prop2: number }) {
    return (...)
}
```

### Declare only used props of a type

If you have a bigger object, let's say `Product`, sometimes a component only needs its `id` or its `name`. Do not use the entire `Product` type as compoent props. Declare only needed types via `Pick` or `Omit`.

```typescript
// ✅ Good
function Component(props: { product: Pick<Product, 'name'> }) {
    const { product } = props
    return <div>Product name: {product.name}</div>
}

// ❌ Bad
function Component(props: { product: Product }) {
    const { product } = props
    return <div>Product name: {product.name}</div>
}
```