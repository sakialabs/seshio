# Contributing to Seshio

Thanks for your interest in contributing to Seshio! This guide will help you get started with contributing code, documentation, or ideas to make Seshio better.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Assume good intentions

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/your-username/seshio.git
cd seshio
```

### 2. Set Up Development Environment

Follow the setup guide in [docs/setup.md](docs/setup.md) to get your local environment running.

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Pick an Issue

Check the issue tracker for tasks labeled `good first issue` or `help wanted`. Comment on the issue to let others know you're working on it.

### Make Changes

- Follow the coding standards below
- Write tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic

### Test Your Changes

```bash
# Backend tests
cd backend && pytest --cov

# Frontend tests
cd frontend && npm test

# Linting
cd backend && black . && ruff check .
cd frontend && npm run lint
```

See [docs/testing.md](docs/testing.md) for comprehensive testing guidelines.

### Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add notebook search functionality"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Create a PR on GitHub with:
- Clear title describing the change
- Description of what changed and why
- Reference to related issues (e.g., "Closes #123")
- Screenshots for UI changes

## Pull Request Checklist

Before submitting your PR:

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No merge conflicts with main branch
- [ ] Commit messages follow conventional commits format

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Coding Standards

### Python (Backend)

Follow PEP 8 with these tools:
- **Black** for formatting (line length: 100)
- **Ruff** for linting
- **mypy** for type checking

Write clear, type-hinted code with docstrings:

```python
async def get_notebook(notebook_id: str) -> Notebook | None:
    """Get notebook by ID.
    
    Args:
        notebook_id: UUID of the notebook
        
    Returns:
        Notebook if found, None otherwise
    """
    async with get_db() as db:
        result = await db.execute(
            select(Notebook).where(Notebook.id == notebook_id)
        )
        return result.scalar_one_or_none()
```

### TypeScript (Frontend)

Use TypeScript for all files with these tools:
- **Prettier** for formatting
- **ESLint** for linting

Write functional components with clear interfaces:

```typescript
interface NotebookCardProps {
  notebook: Notebook;
  onSelect: (id: string) => void;
}

export function NotebookCard({ notebook, onSelect }: NotebookCardProps) {
  return (
    <div onClick={() => onSelect(notebook.id)}>
      <h3>{notebook.name}</h3>
    </div>
  );
}
```

## Testing

Write tests for all new functionality. See [docs/testing.md](docs/testing.md) for comprehensive guidelines.

### Backend Tests

```python
def test_create_notebook():
    """Test notebook creation"""
    notebook = create_notebook(user_id="123", name="Test")
    assert notebook.name == "Test"
```

### Frontend Tests

```typescript
test('renders notebook name', () => {
  render(<NotebookCard notebook={mockNotebook} onSelect={jest.fn()} />);
  expect(screen.getByText('Test Notebook')).toBeInTheDocument();
});
```

Aim for >75% code coverage on new code.

## Documentation

### Code Documentation

- Add docstrings to Python functions
- Add JSDoc comments to TypeScript functions
- Document complex algorithms
- Explain non-obvious code

### User Documentation

Update relevant docs when making changes:
- [docs/tasks.md](docs/tasks.md) - Implementation progress
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - Notable changes

## Review Process

1. **Automated Checks**: CI runs tests and linters
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address review comments
4. **Approval**: Maintainer approves PR
5. **Merge**: PR is merged to main branch

We look for:
- Code quality and style
- Test coverage
- Documentation completeness
- Performance considerations
- Security implications

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, versions)
- Screenshots or error messages

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Alternatives considered

## Questions?

- Check [docs/setup.md](docs/setup.md) for setup help
- Check [docs/testing.md](docs/testing.md) for testing help
- Check [docs/tasks.md](docs/tasks.md) for implementation status
- Open a discussion on GitHub

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thanks for contributing to Seshio! Your work helps make learning better for everyone.
