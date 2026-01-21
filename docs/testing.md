# Testing Guide

Complete guide for testing the Seshio MVP, including unit tests, integration tests, and property-based tests.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [Property-Based Testing](#property-based-testing)
5. [Running Tests](#running-tests)
6. [Writing Tests](#writing-tests)
7. [Test Coverage](#test-coverage)
8. [CI/CD Integration](#cicd-integration)

---

## Testing Philosophy

Seshio uses a pragmatic testing approach:

- **Core functionality**: Comprehensive tests for critical paths
- **Property-based tests**: Validate universal properties across all inputs
- **Unit tests**: Test individual functions and components
- **Integration tests**: Test API endpoints and user flows
- **Optional tests**: Marked with `*` in tasks.md for faster MVP iteration

### Test Pyramid

```
       /\
      /  \     E2E Tests (Few)
     /----\
    /      \   Integration Tests (Some)
   /--------\
  /          \ Unit Tests (Many)
 /------------\
```

---

## Backend Testing

### Test Structure

```
backend/tests/
├── conftest.py              # Shared fixtures
├── test_main.py             # API endpoint tests
├── test_auth.py             # Authentication tests
├── test_notebooks.py        # Notebook CRUD tests
├── test_materials.py        # Material processing tests
├── test_retrieval.py        # Retrieval engine tests
└── test_study.py            # Study mode tests
```

### Running Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov

# Run specific test file
pytest tests/test_auth.py

# Run specific test
pytest tests/test_auth.py::test_login_success

# Run with verbose output
pytest -v

# Run in watch mode (requires pytest-watch)
ptw

# Run only failed tests
pytest --lf
```

### Backend Test Examples

#### Unit Test Example

```python
# tests/test_auth.py
import pytest
from app.services.auth import hash_password, verify_password

def test_password_hashing():
    """Test password hashing and verification"""
    password = "SecurePassword123!"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("WrongPassword", hashed)
```

#### Integration Test Example

```python
# tests/test_notebooks.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_notebook(client: AsyncClient, auth_headers: dict):
    """Test notebook creation endpoint"""
    response = await client.post(
        "/api/notebooks",
        json={"name": "Test Notebook"},
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Notebook"
    assert "id" in data
```

#### Property-Based Test Example

```python
# tests/test_chunking.py
from hypothesis import given, strategies as st
from app.services.chunking import chunk_text

@given(st.text(min_size=1, max_size=10000))
def test_chunking_preserves_content(text: str):
    """Property: Chunking should preserve all content"""
    chunks = chunk_text(text, chunk_size=500, overlap=100)
    reconstructed = "".join(chunk.content for chunk in chunks)
    
    # All original content should be present
    assert all(word in reconstructed for word in text.split())
```

### Backend Test Fixtures

```python
# tests/conftest.py
import pytest
from httpx import AsyncClient
from app.main import app
from app.db.base import get_db

@pytest.fixture
async def client():
    """Async HTTP client for testing"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
async def test_user(db):
    """Create test user"""
    user = User(email="test@example.com", archetype="structured")
    db.add(user)
    await db.commit()
    return user

@pytest.fixture
def auth_headers(test_user):
    """Authentication headers for test user"""
    token = create_access_token(test_user.id)
    return {"Authorization": f"Bearer {token}"}
```

---

## Frontend Testing

### Test Structure

```
frontend/src/
├── __tests__/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignInForm.test.tsx
│   │   │   └── SignUpForm.test.tsx
│   │   └── ui/
│   │       └── Button.test.tsx
│   ├── lib/
│   │   └── utils.test.ts
│   └── pages/
│       └── auth.test.tsx
└── jest.setup.js
```

### Running Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test SignInForm.test.tsx

# Update snapshots
npm test -- -u
```

### Frontend Test Examples

#### Component Test Example

```typescript
// __tests__/components/auth/SignInForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignInForm } from '@/components/auth/SignInForm';

describe('SignInForm', () => {
  it('renders email and password inputs', () => {
    render(<SignInForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits form with valid credentials', async () => {
    const onSubmit = jest.fn();
    render(<SignInForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('displays error for invalid email', async () => {
    render(<SignInForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.blur(screen.getByLabelText(/email/i));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
});
```

#### Hook Test Example

```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';

describe('useAuth', () => {
  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('signs in user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });
    
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('test@example.com');
  });
});
```

#### Property-Based Test Example

```typescript
// __tests__/lib/utils.test.ts
import fc from 'fast-check';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('combines class names correctly', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string()),
        (classNames) => {
          const result = cn(...classNames);
          // Property: Result should be a string
          expect(typeof result).toBe('string');
        }
      )
    );
  });
});
```

---

## Property-Based Testing

Property-based tests validate universal properties that should hold for all inputs.

### Backend (Hypothesis)

```python
from hypothesis import given, strategies as st

@given(st.text(min_size=1))
def test_embedding_dimension(text: str):
    """Property: All embeddings should have same dimension"""
    embedding = generate_embedding(text)
    assert len(embedding) == 768  # Gemini embedding dimension

@given(st.lists(st.text(min_size=1), min_size=1))
def test_retrieval_returns_results(queries: list[str]):
    """Property: Retrieval should always return results"""
    for query in queries:
        results = retrieve_chunks(query, top_k=5)
        assert len(results) <= 5
        assert all(isinstance(r, Chunk) for r in results)
```

### Frontend (fast-check)

```typescript
import fc from 'fast-check';

describe('Input validation', () => {
  it('validates email format', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => {
          // Property: Valid emails should pass validation
          expect(validateEmail(email)).toBe(true);
        }
      )
    );
  });

  it('rejects invalid emails', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('@')),
        (invalidEmail) => {
          // Property: Strings without @ should fail
          expect(validateEmail(invalidEmail)).toBe(false);
        }
      )
    );
  });
});
```

---

## Running Tests

### Run All Tests

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && npm test

# Both (from root)
make test
```

### Run with Coverage

```bash
# Backend
cd backend
pytest --cov
pytest --cov --cov-report=html  # Generate HTML report

# Frontend
cd frontend
npm run test:coverage
```

### Run Specific Tests

```bash
# Backend - by file
pytest tests/test_auth.py

# Backend - by test name
pytest tests/test_auth.py::test_login_success

# Backend - by marker
pytest -m "not slow"

# Frontend - by file
npm test SignInForm.test.tsx

# Frontend - by pattern
npm test -- --testNamePattern="sign in"
```

### Watch Mode

```bash
# Backend (requires pytest-watch)
cd backend
ptw

# Frontend
cd frontend
npm run test:watch
```

---

## Writing Tests

### Test Naming Conventions

```python
# Backend
def test_<function_name>_<scenario>():
    """Test description"""
    pass

# Examples:
def test_create_notebook_success():
def test_create_notebook_invalid_name():
def test_login_with_wrong_password():
```

```typescript
// Frontend
describe('ComponentName', () => {
  it('does something specific', () => {
    // test code
  });
});

// Examples:
describe('SignInForm', () => {
  it('renders email input', () => {});
  it('validates password length', () => {});
  it('submits form on enter key', () => {});
});
```

### Test Structure (AAA Pattern)

```python
def test_example():
    # Arrange - Set up test data
    user = create_test_user()
    notebook_data = {"name": "Test"}
    
    # Act - Perform the action
    notebook = create_notebook(user.id, notebook_data)
    
    # Assert - Verify the result
    assert notebook.name == "Test"
    assert notebook.user_id == user.id
```

### Mocking External Services

```python
# Backend
from unittest.mock import patch, MagicMock

@patch('app.services.gemini.generate_embedding')
def test_material_processing(mock_embedding):
    """Test material processing with mocked embedding"""
    mock_embedding.return_value = [0.1] * 768
    
    result = process_material(material_id)
    
    assert result.status == "completed"
    mock_embedding.assert_called_once()
```

```typescript
// Frontend
jest.mock('@/lib/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

test('creates notebook', async () => {
  const mockPost = apiClient.post as jest.Mock;
  mockPost.mockResolvedValue({ data: { id: '123', name: 'Test' } });
  
  const result = await createNotebook('Test');
  
  expect(result.name).toBe('Test');
  expect(mockPost).toHaveBeenCalledWith('/api/notebooks', { name: 'Test' });
});
```

---

## Test Coverage

### Coverage Goals

- **Critical paths**: 90%+ coverage
- **Business logic**: 80%+ coverage
- **UI components**: 70%+ coverage
- **Overall**: 75%+ coverage

### View Coverage Reports

```bash
# Backend
cd backend
pytest --cov --cov-report=html
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows

# Frontend
cd frontend
npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage Configuration

**Backend** (`backend/.coveragerc`):
```ini
[run]
source = app
omit = 
    */tests/*
    */migrations/*
    */__pycache__/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise NotImplementedError
    if __name__ == .__main__.:
```

**Frontend** (`frontend/jest.config.js`):
```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
};
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest --cov --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Run tests
        run: |
          cd frontend
          npm test -- --coverage
```

### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Set up hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

**`.pre-commit-config.yaml`**:
```yaml
repos:
  - repo: local
    hooks:
      - id: backend-tests
        name: Backend Tests
        entry: bash -c 'cd backend && pytest'
        language: system
        pass_filenames: false
        
      - id: frontend-tests
        name: Frontend Tests
        entry: bash -c 'cd frontend && npm test'
        language: system
        pass_filenames: false
```

---

## Best Practices

### Do's

- ✅ Write tests for new features
- ✅ Test edge cases and error conditions
- ✅ Use descriptive test names
- ✅ Keep tests independent and isolated
- ✅ Mock external dependencies
- ✅ Test user-facing behavior, not implementation
- ✅ Use property-based tests for complex logic
- ✅ Maintain test coverage above 75%

### Don'ts

- ❌ Don't test implementation details
- ❌ Don't write flaky tests
- ❌ Don't skip tests without good reason
- ❌ Don't test third-party libraries
- ❌ Don't make tests dependent on each other
- ❌ Don't use real external services in tests
- ❌ Don't commit failing tests

---

## Troubleshooting

### Backend Test Issues

**Problem**: Tests fail with database errors

**Solution**:
```bash
# Use test database
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seshio_test"
pytest
```

**Problem**: Async tests fail

**Solution**:
```python
# Ensure pytest-asyncio is installed
pip install pytest-asyncio

# Mark async tests
@pytest.mark.asyncio
async def test_async_function():
    result = await async_function()
    assert result is not None
```

### Frontend Test Issues

**Problem**: Tests fail with "Cannot find module"

**Solution**:
```bash
cd frontend
rm -rf node_modules
npm install
```

**Problem**: Tests timeout

**Solution**:
```javascript
// Increase timeout in jest.config.js
module.exports = {
  testTimeout: 10000, // 10 seconds
};
```

---

## Resources

- [pytest Documentation](https://docs.pytest.org/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Hypothesis Documentation](https://hypothesis.readthedocs.io/)
- [fast-check Documentation](https://fast-check.dev/)

---

## Next Steps

- Review [tasks.md](tasks.md) for test requirements
- Check [requirements.md](requirements.md) for testable properties
- See [setup.md](setup.md) for environment setup
- Explore [design.md](design.md) for system architecture
