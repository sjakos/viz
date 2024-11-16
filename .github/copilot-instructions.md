# Technical Stack
- React 19 with Next.js 15
- App Router pattern for routing
- shadcn/ui component library
- Redux for state management using @reduxjs/toolkit

# Code Style Guidelines
1. Use functional components and hooks
2. Avoid class components
3. Define prop types as separate interfaces:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  // ...
}
```
4. Avoid using React.FC type annotation
5. Prefer pure functions and immutable state patterns


# Git Commit Standards
## Format
<type>: <description>

## Types
- feat: new feature
- fix: bug fix
- refactor: code change that neither fixes a bug nor adds a feature
- style: formatting, missing semi colons, etc
- docs: documentation only changes
- test: adding or updating tests

## Rules
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Keep first line under 50 chars

## Examples
```
feat: add user authentication flow
fix: resolve token expiration bug
refactor: simplify error handling logic
docs: update API documentation
test: add unit tests for auth flow
```

# Project Structure
/app - Next.js app router pages
/components - Reusable UI components  
/lib - Core business logic
  /state - Redux store and slices
/types - TypeScript type definitions
