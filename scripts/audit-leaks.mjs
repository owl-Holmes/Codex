// Scans tracked (and staged) files for personal data and secrets before they reach the public repo:
// absolute local paths, personal email addresses, and common API key / private key patterns.
// Usage: npm run audit:leaks   (exit code 1 when something is found). Run before every commit.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const RULES = [
  { name: 'Windows user path', re: /[A-Za-z]:[\\/]+Users[\\/]+[A-Za-z0-9_-]{2,}/ },
  { name: 'Unix home path', re: /\/(?:home|Users)\/[a-z0-9_-]{2,}\//i },
  { name: 'Email address', re: /[\w.+-]+@[\w-]+\.[a-z]{2,}/i, allow: /noreply|@example\.(com|org)/i },
  { name: 'Private key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'GitHub token', re: /\b(?:ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}/ },
  { name: 'AWS key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'OpenAI/Anthropic key', re: /\bsk-(?:ant-)?[A-Za-z0-9_-]{20,}/ },
  { name: 'Slack token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}/ },
  { name: 'Generic secret', re: /\b(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"\s]{12,}['"]/i },
];
const FORBIDDEN_FILES = /(^|\/)(\.env(\..+)?|.*\.pem|.*\.key|id_rsa.*)$/;
const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|mp4|webm|woff2?|ttf|pdf)$/i;

const files = execSync('git ls-files --cached --others --exclude-standard', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);
const findings = [];

for (const file of files) {
  if (FORBIDDEN_FILES.test(file) && !file.endsWith('.env.example')) findings.push(`${file}: forbidden file type`);
  if (BINARY.test(file)) continue;
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue; // deleted in the working tree
  }
  text.split('\n').forEach((line, i) => {
    for (const rule of RULES) {
      const match = line.match(rule.re);
      if (match && !(rule.allow && rule.allow.test(match[0]))) {
        findings.push(`${file}:${i + 1}: ${rule.name} → ${match[0].slice(0, 40)}`);
      }
    }
  });
}

if (findings.length) {
  console.error(`✗ ${findings.length} potential leak(s):\n  ${findings.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ No leaks found in ${files.length} files.`);
