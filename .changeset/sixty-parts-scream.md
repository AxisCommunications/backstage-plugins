---
'@axis-backstage/plugin-jira-dashboard-backend': major
---

**Added configurable cache TTL (Time-To-Live) for Jira API responses**

This release introduces comprehensive cache TTL configuration support for the Jira Dashboard backend plugin:

## Configuration Examples

```yaml
# Single instance with custom TTL
jira:
  baseUrl: 'https://your-jira-instance.com'
  cacheTtl: '30m'  # Cache for 30 minutes

# Multiple instances with different TTL settings
jira:
  instances:
    - name: 'production'
      baseUrl: 'https://prod-jira.com'
      cacheTtl: '2h'  # Cache for 2 hours
```

## Breaking Changes

- A default cache TTL of 1 hour is now applied to all cached responses
- This may change caching behavior for deployments relying on indefinite cache duration
