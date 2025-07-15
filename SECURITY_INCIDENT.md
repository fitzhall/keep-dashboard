# SECURITY INCIDENT - EXPOSED SERVICE KEY

## Incident Date: 2025-01-14

### What Happened:
- Supabase service_role key was accidentally committed to public GitHub repository
- GitHub detected this and sent security alert
- Key was exposed in: scripts/setup-database.ts

### Exposed Key (NOW INVALID - DO NOT USE):
- Service Role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppY2RneWlybHZ3ZXdxc2FjeXlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNDk4OCwiZXhwIjoyMDY4MTAwOTg4fQ.YuiZ0IfrFk35on7HEHPJeJ6MUQ4TsElAU-M2xQdqank

### Actions Taken:
1. ✅ Removed files containing keys from repository
2. ✅ Added scripts/ to .gitignore
3. ⏳ Waiting for Supabase support to rotate key (no UI option available)
4. ⏳ Monitoring database for unauthorized access

### Next Steps:
1. Contact Supabase support for immediate key rotation
2. Once new key received, update in Vercel environment variables
3. Audit database for any unauthorized changes
4. Implement secret scanning in CI/CD pipeline

### Lessons Learned:
- Never hardcode credentials in source files
- Always use environment variables
- Add pre-commit hooks to scan for secrets