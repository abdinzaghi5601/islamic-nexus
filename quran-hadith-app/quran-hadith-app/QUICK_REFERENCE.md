# 📚 Quick Reference Guide - Islamic Nexus Self-Hosting

**Essential commands and troubleshooting for your Oracle Cloud deployment**

---

## 🔐 SSH Connection

```bash
# Connect to your Oracle VM
ssh -i ~/.ssh/oracle_islamic_nexus ubuntu@YOUR_VM_IP

# If permission denied:
chmod 600 ~/.ssh/oracle_islamic_nexus
```

---

## 🚀 Application Management

### Check Status
```bash
pm2 status
```

### View Logs
```bash
# Real-time logs
pm2 logs islamic-nexus

# Last 50 lines
pm2 logs islamic-nexus --lines 50

# Only errors
pm2 logs islamic-nexus --err
```

### Restart Application
```bash
pm2 restart islamic-nexus
```

### Stop Application
```bash
pm2 stop islamic-nexus
```

### Start Application
```bash
pm2 start islamic-nexus
```

---

## 📦 Deploy Code Updates

```bash
# SSH into server
ssh -i ~/.ssh/oracle_islamic_nexus ubuntu@YOUR_VM_IP

# Navigate to project
cd /var/www/islamic-nexus

# Pull latest code
git pull origin master

# Install new dependencies (if package.json changed)
npm install

# Run database migrations (if schema changed)
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart
pm2 restart islamic-nexus

# Check logs for errors
pm2 logs islamic-nexus --lines 20
```

---

## 🗄️ Database Management

### Connect to MySQL
```bash
mysql -u nexus_user -p islamic_nexus_prod
```

### Common MySQL Commands
```sql
-- Show all tables
SHOW TABLES;

-- Count records
SELECT COUNT(*) FROM Ayah;
SELECT COUNT(*) FROM Hadith;
SELECT COUNT(*) FROM User;

-- Check table structure
DESCRIBE Ayah;

-- Exit MySQL
EXIT;
```

### Backup Database
```bash
# Manual backup
mysqldump -u nexus_user -p islamic_nexus_prod > backup_$(date +%Y%m%d).sql

# Compress backup
gzip backup_*.sql

# Check backups
ls -lh ~/backups/
```

### Restore Database
```bash
# Uncompress backup
gunzip backup_20240122.sql.gz

# Restore
mysql -u nexus_user -p islamic_nexus_prod < backup_20240122.sql
```

---

## 🌐 Cloudflare Tunnel Management

### Check Tunnel Status
```bash
sudo systemctl status cloudflared
```

### Restart Tunnel
```bash
sudo systemctl restart cloudflared
```

### View Tunnel Logs
```bash
# Real-time logs
sudo journalctl -u cloudflared -f

# Last 50 lines
sudo journalctl -u cloudflared -n 50
```

### Stop Tunnel
```bash
sudo systemctl stop cloudflared
```

### Start Tunnel
```bash
sudo systemctl start cloudflared
```

---

## 💾 System Maintenance

### Check Disk Space
```bash
df -h
```

### Check Memory Usage
```bash
free -h
```

### Check CPU Usage
```bash
top
# Press 'q' to quit
```

### Update System Packages
```bash
sudo apt update
sudo apt upgrade -y
```

### Check Running Processes
```bash
ps aux | grep node
ps aux | grep mysql
ps aux | grep nginx
```

---

## 🔥 Firewall Management

### Check Firewall Status
```bash
sudo ufw status
```

### Allow New Port (if needed)
```bash
sudo ufw allow 8080/tcp
```

### Check Open Ports
```bash
sudo netstat -tuln | grep LISTEN
```

---

## 📊 Monitoring Commands

### Check Application Response Time
```bash
curl -w "@-" -o /dev/null -s "http://localhost:3000" <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

### Check SSL Certificate
```bash
echo | openssl s_client -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Check DNS
```bash
nslookup your-domain.com
dig your-domain.com
```

---

## 🐛 Troubleshooting

### Website Not Loading

**1. Check if app is running:**
```bash
pm2 status
# If stopped:
pm2 restart islamic-nexus
```

**2. Check application logs:**
```bash
pm2 logs islamic-nexus --lines 50
```

**3. Check Cloudflare tunnel:**
```bash
sudo systemctl status cloudflared
# If not running:
sudo systemctl restart cloudflared
```

**4. Test local connection:**
```bash
curl http://localhost:3000
# Should return HTML
```

### Database Connection Errors

**1. Check MySQL is running:**
```bash
sudo systemctl status mysql
# If not running:
sudo systemctl restart mysql
```

**2. Test connection:**
```bash
mysql -u nexus_user -p islamic_nexus_prod
```

**3. Check .env.local:**
```bash
cat /var/www/islamic-nexus/.env.local | grep DATABASE_URL
```

### Out of Disk Space

**1. Check disk usage:**
```bash
df -h
du -sh /var/www/islamic-nexus
du -sh ~/backups
```

**2. Clean up:**
```bash
# Remove old logs
pm2 flush

# Clean npm cache
npm cache clean --force

# Remove old backups (keep last 7)
cd ~/backups
ls -t | tail -n +8 | xargs rm -f

# Clean apt cache
sudo apt clean
```

### High Memory Usage

**1. Check memory:**
```bash
free -h
```

**2. Check processes:**
```bash
top
# Press 'M' to sort by memory
# Press 'q' to quit
```

**3. Restart application:**
```bash
pm2 restart islamic-nexus
```

### SSL Certificate Errors

**1. Check certificate:**
```bash
curl -vI https://your-domain.com 2>&1 | grep -i ssl
```

**2. Check Cloudflare:**
- Login to Cloudflare Dashboard
- Go to SSL/TLS → Overview
- Should be set to "Full" or "Full (strict)"

---

## 🔧 Environment Variables

### View Current Variables
```bash
cat /var/www/islamic-nexus/.env.local
```

### Edit Variables
```bash
nano /var/www/islamic-nexus/.env.local
# After editing, rebuild and restart:
npm run build
pm2 restart islamic-nexus
```

---

## 📈 Performance Optimization

### Enable Production Mode
```bash
# In .env.local
NODE_ENV=production
```

### Clear All Caches
```bash
# Clear npm cache
npm cache clean --force

# Clear Next.js cache
rm -rf /var/www/islamic-nexus/.next

# Rebuild
npm run build
pm2 restart islamic-nexus
```

### Check Build Size
```bash
du -sh /var/www/islamic-nexus/.next
```

---

## 🔐 Security

### Check for Updates
```bash
sudo apt update
sudo apt list --upgradable
```

### Update All Packages
```bash
sudo apt update && sudo apt upgrade -y
```

### Check Failed Login Attempts
```bash
sudo grep "Failed password" /var/log/auth.log | tail -20
```

### Change MySQL Password
```bash
mysql -u root -p
```
```sql
ALTER USER 'nexus_user'@'localhost' IDENTIFIED BY 'NEW_PASSWORD';
FLUSH PRIVILEGES;
EXIT;
```

Then update in `.env.local`:
```bash
nano /var/www/islamic-nexus/.env.local
# Update DATABASE_URL with new password
```

---

## 📝 Useful File Locations

```
Application Code:       /var/www/islamic-nexus/
Environment File:       /var/www/islamic-nexus/.env.local
PM2 Logs:              ~/.pm2/logs/
Database Backups:       ~/backups/
Cloudflare Config:      ~/.cloudflared/config.yml
SSH Keys:               ~/.ssh/
Nginx Config:          /etc/nginx/sites-available/
MySQL Config:          /etc/mysql/
```

---

## 🆘 Emergency Contacts

### If Server is Down:

1. **Check Oracle Cloud Console:**
   - https://cloud.oracle.com
   - Check if VM is running

2. **Check Cloudflare:**
   - https://dash.cloudflare.com
   - Check tunnel status

3. **SSH and Check Logs:**
   ```bash
   ssh -i ~/.ssh/oracle_islamic_nexus ubuntu@YOUR_VM_IP
   pm2 logs
   sudo journalctl -u cloudflared -n 50
   ```

### Recovery Steps:

**Full Application Restart:**
```bash
pm2 restart all
sudo systemctl restart cloudflared
sudo systemctl restart nginx
sudo systemctl restart mysql
```

**Nuclear Option (if nothing works):**
```bash
# Backup first!
cd /var/www/islamic-nexus
git stash
git pull origin master
npm install
npx prisma migrate deploy
npm run build
pm2 restart islamic-nexus
```

---

## 📞 Getting Help

### Check Logs First:
```bash
pm2 logs islamic-nexus --lines 100
sudo journalctl -u cloudflared -n 100
tail -100 /var/log/syslog
```

### Community Resources:
- Oracle Cloud: r/oraclecloud
- Next.js: https://github.com/vercel/next.js/discussions
- Cloudflare: https://community.cloudflare.com/

### Copy Error Messages:
When asking for help, always include:
1. The exact error message
2. What you were trying to do
3. Relevant log output
4. Your environment (Oracle Cloud, Next.js version, etc.)

---

## 📋 Daily Checklist (Optional)

- [ ] Check `pm2 status` - all green?
- [ ] Check disk space: `df -h` - below 80%?
- [ ] Check recent logs: `pm2 logs --lines 20` - no errors?
- [ ] Test website: Opens in browser?
- [ ] Check Cloudflare dashboard - tunnel connected?

---

## 💰 Cost Monitoring

### Check Oracle Cloud:
- Dashboard → Billing & Cost Management
- Should always show $0 for Free Tier

### Check OpenAI Usage (if using AI):
- https://platform.openai.com/usage
- Monitor daily spending

### Set Alerts:
- Oracle: Can set up billing alerts
- OpenAI: Can set usage limits in settings

---

## 🎉 Quick Wins

### Speed Up Deployment:
Create alias in `~/.bashrc`:
```bash
alias deploy="cd /var/www/islamic-nexus && git pull && npm install && npm run build && pm2 restart islamic-nexus && pm2 logs --lines 20"
```

Then just run:
```bash
deploy
```

### Auto-Backup Script:
Already set up! Runs daily at 2 AM.
Check backups:
```bash
ls -lh ~/backups/
```

### View Latest Backup:
```bash
ls -lht ~/backups/ | head -5
```

---

**Save this guide for quick reference!**
**Bookmark it or print it out.** 📌

**Questions? Check the main guides:**
- `ORACLE_CLOUD_MIGRATION_GUIDE.md`
- `AI_SEARCH_INTEGRATION_GUIDE.md`
