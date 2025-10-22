# 🚀 Oracle Cloud Free Tier Migration Guide - Islamic Nexus

**Complete guide to migrate from Railway/Vercel to Oracle Cloud (100% FREE forever)**

**Time Required:** 2-3 hours (mostly waiting for approvals)
**Cost:** $0/month (only domain cost ~$12/year)
**Difficulty:** Medium (but we'll make it easy!)

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] Credit card (for Oracle verification - won't be charged)
- [ ] Valid email address
- [ ] Domain name (or ready to buy one from Namecheap/GoDaddy)
- [ ] GitHub account with your Islamic Nexus code
- [ ] Current Railway/Vercel access to export database

---

## Phase 1: Create Oracle Cloud Account

### Step 1.1: Sign Up (5 minutes)

1. **Go to Oracle Cloud Free Tier:**
   ```
   https://www.oracle.com/cloud/free/
   ```

2. **Click "Start for free"**

3. **Fill in Account Information:**
   ```
   Email: your.email@gmail.com (use real email)
   Country: [Your actual country]
   First Name: [Your legal first name]
   Last Name: [Your legal last name]
   ```

4. **Choose Cloud Account Name:**
   ```
   Example: islamic-nexus-prod
   Note: This becomes part of your login URL
   ```

5. **Select Home Region:**
   ```
   Recommended regions (usually less congested):
   - US East (Ashburn)
   - Germany Central (Frankfurt)
   - UK South (London)

   ⚠️ IMPORTANT: You CANNOT change this later!
   Choose based on your target audience location
   ```

### Step 1.2: Verify Email & Identity (10 minutes)

1. **Check your email** for verification link
2. **Click the verification link**
3. **Fill in additional details:**
   - Address (must be real)
   - Phone number (must be valid - may receive verification call/SMS)

4. **Add Payment Verification:**
   ```
   ⚠️ IMPORTANT:
   - Use a REAL credit/debit card (not virtual/prepaid)
   - Oracle will do a $1 temporary authorization (refunded immediately)
   - You will NOT be charged as long as you stay in Free Tier
   - This is ONLY to prevent abuse/bots
   ```

5. **Complete CAPTCHA** and submit

### Step 1.3: Wait for Approval (24-72 hours)

- **Check email** for approval notification
- Subject will be: "Your Oracle Cloud Account is Ready"
- If rejected, wait 24 hours and reapply with accurate info

**☕ While Waiting:** Export your database from Railway (next section)

---

## Phase 2: Export Database from Railway

### Step 2.1: Get Railway Database Connection

1. **Open terminal** on your PC

2. **Login to Railway CLI:**
   ```bash
   # If you don't have Railway CLI installed:
   npm install -g @railway/cli

   # Login
   railway login
   ```

3. **Link to your project:**
   ```bash
   cd /mnt/c/Users/abdul/Desktop/MY\ Quran\ and\ Hadith\ \ Project/quran-hadith-app/quran-hadith-app
   railway link
   ```

4. **Get your DATABASE_URL:**
   ```bash
   railway variables
   ```

   You'll see something like:
   ```
   DATABASE_URL=mysql://user:password@host.railway.app:3306/railway
   ```

### Step 2.2: Export Your Database

**For MySQL (Railway default):**
```bash
# Export all data
mysqldump -h containers-us-west-xxx.railway.app \
  -P 3306 \
  -u root \
  -p \
  railway > islamic_nexus_backup_$(date +%Y%m%d).sql

# When prompted, enter your password (from DATABASE_URL)
```

**For PostgreSQL (if you use it):**
```bash
pg_dump "postgresql://user:pass@host.railway.app:5432/railway" > islamic_nexus_backup_$(date +%Y%m%d).sql
```

**Verify backup:**
```bash
ls -lh islamic_nexus_backup_*.sql
# Should show file size (probably 50-200 MB)

# Check it's not empty
head -20 islamic_nexus_backup_*.sql
# Should show SQL CREATE TABLE statements
```

✅ **Keep this backup file safe! This is all your data.**

---

## Phase 3: Create Oracle Cloud VM

### Step 3.1: Login to Oracle Cloud Console

Once you receive approval email:

1. **Go to:** https://cloud.oracle.com
2. **Login** with your Oracle Cloud account
3. **You'll see the Oracle Cloud Dashboard**

### Step 3.2: Create Compute Instance (The VM)

1. **Click hamburger menu** (☰) → **Compute** → **Instances**

2. **Click "Create Instance"**

3. **Configure Instance:**

   **Name:**
   ```
   islamic-nexus-production
   ```

   **Placement:**
   - Availability Domain: (keep default)

   **Image:**
   - Click "Change Image"
   - Select: **Canonical Ubuntu 22.04**
   - Click "Select Image"

   **Shape:**
   - Click "Change Shape"
   - Select: **Ampere (ARM-based processor)**
   - Select: **VM.Standard.A1.Flex**
   - Set OCPUs: **4** (maximum free)
   - Set Memory: **24 GB** (maximum free)
   - Click "Select Shape"

4. **Networking:**

   - **Create new virtual cloud network** (checked)
   - VCN Name: `islamic-nexus-vcn`
   - **Create new public subnet** (checked)
   - Subnet Name: `islamic-nexus-subnet`
   - **Assign a public IPv4 address** (checked) ✓

5. **Add SSH Keys:**

   **On your PC, generate SSH key:**
   ```bash
   # Windows PowerShell or Linux/Mac terminal:
   cd ~
   ssh-keygen -t rsa -b 4096 -f oracle_islamic_nexus

   # Press Enter for no passphrase (or set one if you prefer)
   ```

   **This creates two files:**
   - `oracle_islamic_nexus` (private key - KEEP SECRET!)
   - `oracle_islamic_nexus.pub` (public key - upload to Oracle)

   **Upload Public Key:**
   - In Oracle Console, select: "Paste public keys"
   - Open `oracle_islamic_nexus.pub` file and copy contents
   - Paste into Oracle

6. **Boot Volume:**
   - Keep defaults (50GB is plenty)

7. **Click "Create"**

### Step 3.3: Wait for Instance Creation (2-5 minutes)

- Status will change from "PROVISIONING" → "RUNNING"
- **Note down your Public IP Address** (looks like: 123.45.67.89)

### Step 3.4: Configure Firewall (Security Lists)

⚠️ **IMPORTANT:** Oracle's firewall blocks everything by default!

1. **Click on your instance name** (islamic-nexus-production)

2. **Click on the subnet name** under "Primary VNIC"

3. **Click "Default Security List"**

4. **Click "Add Ingress Rules"** and add:

   **Rule 1: HTTP**
   ```
   Source CIDR: 0.0.0.0/0
   IP Protocol: TCP
   Destination Port Range: 80
   Description: Allow HTTP
   ```

   **Rule 2: HTTPS**
   ```
   Source CIDR: 0.0.0.0/0
   IP Protocol: TCP
   Destination Port Range: 443
   Description: Allow HTTPS
   ```

   **Rule 3: SSH (already exists, verify it's there)**
   ```
   Source CIDR: 0.0.0.0/0
   IP Protocol: TCP
   Destination Port Range: 22
   Description: Allow SSH
   ```

5. **Click "Add Ingress Rules"** for each

✅ **Your VM is now ready!**

---

## Phase 4: Initial Server Setup

### Step 4.1: Connect to Your VM

**On Windows (PowerShell):**
```powershell
ssh -i C:\Users\abdul\.ssh\oracle_islamic_nexus ubuntu@YOUR_VM_PUBLIC_IP
```

**On Linux/Mac:**
```bash
ssh -i ~/oracle_islamic_nexus ubuntu@YOUR_VM_PUBLIC_IP
```

**First time connection:**
```
The authenticity of host '123.45.67.89' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
```

You should see:
```
Welcome to Ubuntu 22.04.x LTS
ubuntu@islamic-nexus-production:~$
```

✅ **You're now connected to your Oracle Cloud VM!**

### Step 4.2: Update System

```bash
# Update package lists
sudo apt update

# Upgrade all packages (takes 5-10 minutes)
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential
```

### Step 4.3: Configure Ubuntu Firewall (UFW)

Oracle has external firewall, but let's also enable Ubuntu's internal firewall:

```bash
# Allow SSH (important! Don't lock yourself out)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

Should show:
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

### Step 4.4: Install Node.js 20

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version   # Should show: v20.x.x
npm --version    # Should show: v10.x.x
```

### Step 4.5: Install MySQL

```bash
# Install MySQL Server
sudo apt install -y mysql-server

# Check it's running
sudo systemctl status mysql
# Should show: "active (running)"
```

**Secure MySQL Installation:**
```bash
sudo mysql_secure_installation
```

Answer the prompts:
```
Validate Password Component? N
Set root password? Y
  → Enter strong password (save it!)
  → Re-enter password
Remove anonymous users? Y
Disallow root login remotely? Y
Remove test database? Y
Reload privilege tables? Y
```

**Test MySQL:**
```bash
sudo mysql -u root -p
# Enter your password
```

You should see:
```
mysql>
```

Type:
```sql
SELECT VERSION();
EXIT;
```

✅ **MySQL is installed and working!**

### Step 4.6: Install Nginx

```bash
# Install Nginx web server
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
# Should show: "active (running)"

# Test
curl http://localhost
# Should show HTML output
```

### Step 4.7: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify
pm2 --version
```

✅ **All core software installed!**

---

## Phase 5: Set Up Database

### Step 5.1: Create Database and User

```bash
# Login to MySQL as root
sudo mysql -u root -p
# Enter your MySQL root password
```

**Create database and user:**
```sql
-- Create production database
CREATE DATABASE islamic_nexus_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user (replace YOUR_STRONG_PASSWORD)
CREATE USER 'nexus_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD_HERE';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON islamic_nexus_prod.* TO 'nexus_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
-- Should show islamic_nexus_prod

-- Exit
EXIT;
```

**Save your credentials:**
```
Database: islamic_nexus_prod
Username: nexus_user
Password: YOUR_STRONG_PASSWORD_HERE
Host: localhost
Port: 3306
```

### Step 5.2: Upload and Import Your Backup

**On your local PC:**
```bash
# Upload backup to Oracle VM
scp -i C:\Users\abdul\.ssh\oracle_islamic_nexus islamic_nexus_backup_*.sql ubuntu@YOUR_VM_IP:/home/ubuntu/
```

**On Oracle VM (SSH session):**
```bash
# Check file uploaded
ls -lh ~/islamic_nexus_backup_*.sql

# Import data (replace with your actual filename and password)
mysql -u nexus_user -p islamic_nexus_prod < ~/islamic_nexus_backup_*.sql

# This may take 2-10 minutes depending on data size
# No output means success!
```

**Verify import:**
```bash
mysql -u nexus_user -p islamic_nexus_prod
```

```sql
-- Check tables exist
SHOW TABLES;

-- Should show your tables like:
-- Ayah, Surah, Hadith, HadithBook, Dua, User, etc.

-- Check data count
SELECT COUNT(*) FROM Ayah;
-- Should show 6236 (or your actual count)

SELECT COUNT(*) FROM Hadith;
-- Should show thousands of hadiths

EXIT;
```

✅ **Database imported successfully!**

---

## Phase 6: Deploy Your Application

### Step 6.1: Clone Your Repository

```bash
# Create web directory
sudo mkdir -p /var/www
sudo chown ubuntu:ubuntu /var/www

# Clone your repository
cd /var/www
git clone https://github.com/abdinzaghi5601/islamic-nexus.git islamic-nexus

# Enter directory
cd islamic-nexus

# Check files are there
ls -la
```

### Step 6.2: Install Dependencies

```bash
# Install all npm packages
npm install

# This takes 3-5 minutes
# You'll see: "added XXX packages"
```

### Step 6.3: Create Environment File

```bash
# Create production environment file
nano .env.local
```

**Add this content (update YOUR_PASSWORD and YOUR_DOMAIN):**
```env
# Database Connection
DATABASE_URL="mysql://nexus_user:YOUR_STRONG_PASSWORD_HERE@localhost:3306/islamic_nexus_prod"

# NextAuth Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="GENERATE_RANDOM_STRING_HERE"

# OpenAI API (for AI search - we'll set this up later)
OPENAI_API_KEY=""

# Node Environment
NODE_ENV="production"
```

**Generate NEXTAUTH_SECRET:**
```bash
# Open new terminal on VM
openssl rand -base64 32
# Copy the output and paste it as NEXTAUTH_SECRET value
```

**Save file:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

### Step 6.4: Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Should see: "All migrations have been successfully applied"
```

### Step 6.5: Build Application

```bash
# Build for production
npm run build

# This takes 5-10 minutes
# You'll see compilation progress
# Should end with: "✓ Compiled successfully"
```

### Step 6.6: Start Application with PM2

```bash
# Start application
pm2 start npm --name "islamic-nexus" -- start

# Check status
pm2 status
# Should show: islamic-nexus | online

# View logs
pm2 logs islamic-nexus --lines 50

# Should see: "Ready in X ms" or "Listening on port 3000"
```

**Make PM2 start on boot:**
```bash
# Generate startup script
pm2 startup

# Copy and run the command it shows (something like):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Save current PM2 process list
pm2 save
```

**Test locally:**
```bash
curl http://localhost:3000
# Should see HTML output (your homepage)
```

✅ **Application is running!**

---

## Phase 7: Set Up Cloudflare Tunnel

### Step 7.1: Create Cloudflare Account

1. **Go to:** https://dash.cloudflare.com/sign-up
2. **Sign up** with your email
3. **Verify email**
4. **Login** to Cloudflare Dashboard

### Step 7.2: Add Your Domain to Cloudflare

1. **Click "Add a Site"**
2. **Enter your domain:** `your-domain.com`
3. **Click "Add Site"**
4. **Select "Free Plan"**
5. **Click "Continue"**

6. **Cloudflare will scan your DNS records**
   - Click "Continue"

7. **Update Nameservers:**
   - Cloudflare will show you 2 nameservers like:
     ```
     carter.ns.cloudflare.com
     esme.ns.cloudflare.com
     ```
   - **Copy these**

8. **Go to your domain registrar** (Namecheap, GoDaddy, etc.)
   - Find "Domain Management" or "DNS Settings"
   - Change nameservers to Cloudflare's nameservers
   - Save changes

9. **Back in Cloudflare, click "Done, check nameservers"**

10. **Wait for verification** (5-60 minutes)
    - Cloudflare will email you when verified

### Step 7.3: Install Cloudflared on VM

**On your Oracle VM (SSH session):**

```bash
# Download Cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb

# Install
sudo dpkg -i cloudflared-linux-arm64.deb

# Verify
cloudflared --version
# Should show version number
```

### Step 7.4: Authenticate Cloudflared

```bash
# Login to Cloudflare
cloudflared tunnel login
```

**This will show a URL like:**
```
https://dash.cloudflare.com/argotunnel?callback=https://login.cloudflareaccess.org/...
```

**Copy this URL:**
1. Open in your browser
2. Login to Cloudflare
3. Select your domain (your-domain.com)
4. Click "Authorize"
5. You'll see: "Success! You may close this window"

**Back in terminal:**
```
You should see: "Successfully logged in"
```

### Step 7.5: Create Tunnel

```bash
# Create tunnel named "islamic-nexus"
cloudflared tunnel create islamic-nexus
```

**Output will show:**
```
Tunnel credentials written to: /home/ubuntu/.cloudflared/XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX.json
Created tunnel islamic-nexus with id XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

**Copy and save the TUNNEL-ID** (the UUID shown)

### Step 7.6: Configure Tunnel

```bash
# Create config directory
mkdir -p ~/.cloudflared

# Create config file
nano ~/.cloudflared/config.yml
```

**Add this content (replace YOUR-TUNNEL-ID and your-domain.com):**
```yaml
tunnel: YOUR-TUNNEL-ID
credentials-file: /home/ubuntu/.cloudflared/YOUR-TUNNEL-ID.json

ingress:
  - hostname: your-domain.com
    service: http://localhost:3000
  - hostname: www.your-domain.com
    service: http://localhost:3000
  - service: http_status:404
```

**Save file:** `Ctrl+X`, `Y`, `Enter`

### Step 7.7: Route DNS to Tunnel

```bash
# Route main domain
cloudflared tunnel route dns islamic-nexus your-domain.com

# Route www subdomain
cloudflared tunnel route dns islamic-nexus www.your-domain.com
```

**You should see:**
```
Created CNAME your-domain.com which will route to this tunnel
Created CNAME www.your-domain.com which will route to this tunnel
```

### Step 7.8: Run Tunnel as Service

```bash
# Install as system service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared

# Enable on boot
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
# Should show: "active (running)"

# View logs
sudo journalctl -u cloudflared -f
# Should show: "Connection established" or "Registered tunnel connection"
# Press Ctrl+C to exit logs
```

✅ **Cloudflare Tunnel is connected!**

---

## Phase 8: Final Verification

### Step 8.1: Wait for DNS Propagation (5-30 minutes)

```bash
# Check if DNS is propagated
nslookup your-domain.com

# Should show Cloudflare IP addresses (like 104.21.x.x or 172.67.x.x)
```

### Step 8.2: Test Your Website

**Open browser and visit:**
```
https://your-domain.com
```

**You should see:**
- ✅ Your Islamic Nexus homepage
- ✅ Green padlock (HTTPS working)
- ✅ Fast loading
- ✅ All pages work

**Test all functionality:**
- [ ] Homepage loads
- [ ] Quran pages work
- [ ] Hadith pages work
- [ ] Duas page works
- [ ] Search functionality
- [ ] User authentication (if applicable)
- [ ] Bookmarks work
- [ ] All images load

### Step 8.3: Check Performance

**In browser DevTools (F12):**
- Network tab → Should see fast load times
- Console → No errors
- Check SSL certificate (click padlock → certificate is valid)

**Test from different devices:**
- Mobile phone
- Tablet
- Different browsers

✅ **Everything working? Congratulations!** 🎉

---

## Phase 9: Set Up Monitoring & Backups

### Step 9.1: Set Up Automatic Database Backups

```bash
# Create backups directory
mkdir -p ~/backups

# Create backup script
nano ~/backup_database.sh
```

**Add this content:**
```bash
#!/bin/bash

# Configuration
DB_NAME="islamic_nexus_prod"
DB_USER="nexus_user"
DB_PASS="YOUR_STRONG_PASSWORD_HERE"
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/islamic_nexus_$DATE.sql"

# Create backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "islamic_nexus_*.sql.gz" -mtime +7 -delete

# Log
echo "Backup created: $BACKUP_FILE.gz at $(date)"
```

**Make it executable:**
```bash
chmod +x ~/backup_database.sh

# Test it
./backup_database.sh

# Check backup exists
ls -lh ~/backups/
```

**Schedule daily backups:**
```bash
# Edit crontab
crontab -e

# Select editor (choose nano, usually option 1)

# Add this line at the end (runs daily at 2 AM):
0 2 * * * /home/ubuntu/backup_database.sh >> /home/ubuntu/backups/backup.log 2>&1

# Save and exit
```

### Step 9.2: Set Up PM2 Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Set up PM2 monitoring dashboard (optional)
pm2 web
# Will show: "PM2 web interface listening on port 9615"
```

### Step 9.3: Set Up Alert Email (Optional)

Create simple monitoring script:

```bash
nano ~/check_app.sh
```

```bash
#!/bin/bash

# Check if app is running
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "Islamic Nexus app is DOWN at $(date)" | mail -s "Alert: App Down" your@email.com
    # Restart app
    pm2 restart islamic-nexus
fi
```

```bash
chmod +x ~/check_app.sh

# Add to crontab (check every 5 minutes)
crontab -e
# Add:
*/5 * * * * /home/ubuntu/check_app.sh
```

---

## Phase 10: Clean Up Old Services

### Step 10.1: Export Final Data from Railway (if not done)

Make sure you have the latest data before deleting Railway.

### Step 10.2: Delete Railway Project

1. Login to Railway: https://railway.app/
2. Go to your project
3. Click Settings
4. Scroll down → Click "Delete Project"
5. Type project name to confirm
6. Click "Delete"

### Step 10.3: Delete Vercel Project

1. Login to Vercel: https://vercel.com/
2. Go to your project
3. Click Settings
4. Scroll down → Click "Delete Project"
5. Type project name to confirm
6. Click "Delete"

✅ **You're now 100% self-hosted and FREE!**

---

## Maintenance & Updates

### Daily Checks (Optional, 1 minute)

```bash
# SSH into server
ssh -i ~/.ssh/oracle_islamic_nexus ubuntu@YOUR_VM_IP

# Check app status
pm2 status

# Check recent logs
pm2 logs islamic-nexus --lines 20

# Check disk space
df -h
```

### When You Update Code

```bash
# SSH into server
ssh -i ~/.ssh/oracle_islamic_nexus ubuntu@YOUR_VM_IP

# Navigate to app directory
cd /var/www/islamic-nexus

# Pull latest code
git pull origin master

# Install any new dependencies
npm install

# Run migrations if any
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart application
pm2 restart islamic-nexus

# Check logs
pm2 logs islamic-nexus
```

### Monthly Maintenance (10 minutes)

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update npm packages
cd /var/www/islamic-nexus
npm outdated  # Check outdated packages
npm update    # Update packages

# Rebuild
npm run build

# Restart
pm2 restart islamic-nexus

# Check backups
ls -lh ~/backups/

# Check disk usage
df -h
du -sh /var/www/islamic-nexus
```

---

## Troubleshooting

### Issue 1: Can't connect via SSH

**Solution:**
```bash
# Check you're using correct key file
ls -la ~/.ssh/oracle_islamic_nexus

# Check permissions (should be 600 for private key)
chmod 600 ~/.ssh/oracle_islamic_nexus

# Try with verbose logging
ssh -v -i ~/.ssh/oracle_islamic_nexus ubuntu@YOUR_VM_IP
```

### Issue 2: Website not loading

**Check 1: Is app running?**
```bash
pm2 status
# If stopped:
pm2 restart islamic-nexus
```

**Check 2: Is Cloudflare tunnel running?**
```bash
sudo systemctl status cloudflared
# If not running:
sudo systemctl restart cloudflared
```

**Check 3: Check application logs:**
```bash
pm2 logs islamic-nexus --lines 50
```

**Check 4: Check Cloudflare tunnel logs:**
```bash
sudo journalctl -u cloudflared -n 50
```

### Issue 3: Database connection errors

**Check MySQL is running:**
```bash
sudo systemctl status mysql
# If not running:
sudo systemctl restart mysql
```

**Test connection:**
```bash
mysql -u nexus_user -p islamic_nexus_prod
# Enter password
# Should connect
```

**Check .env.local file:**
```bash
cat /var/www/islamic-nexus/.env.local
# Verify DATABASE_URL is correct
```

### Issue 4: Out of disk space

**Check disk usage:**
```bash
df -h
du -sh /var/www/islamic-nexus
du -sh ~/backups
```

**Clean up:**
```bash
# Remove old logs
pm2 flush

# Clean npm cache
npm cache clean --force

# Remove old backups manually
rm ~/backups/old_backup_file.sql.gz

# Clean apt cache
sudo apt clean
```

### Issue 5: "Out of capacity" when creating ARM instance

**Solutions:**

1. **Try different times of day:**
   - Early morning (2-6 AM your time)
   - Late night (11 PM - 2 AM)

2. **Try different regions:**
   - Go back and select a different home region
   - Less popular regions: Phoenix, Seoul, Mumbai

3. **Use automation script:**
   ```bash
   # Check availability every minute
   while true; do
     oci compute instance launch --availability-domain ... \
       && echo "SUCCESS!" && break || sleep 60
   done
   ```

4. **Use AMD instances instead:**
   - Use 2 × VM.Standard.E2.1.Micro (1GB RAM each)
   - Still free, just less powerful
   - Your app will still work fine

---

## Success Checklist

Before considering migration complete, verify:

- [ ] Oracle VM is running and accessible via SSH
- [ ] All system software installed (Node, MySQL, Nginx, PM2)
- [ ] Database imported successfully with all data
- [ ] Application builds without errors
- [ ] Application runs with PM2
- [ ] Cloudflare Tunnel connected and showing "healthy"
- [ ] Domain DNS propagated (nslookup shows Cloudflare IPs)
- [ ] Website loads over HTTPS
- [ ] All pages work (Quran, Hadith, Duas, Search)
- [ ] Database queries work (search returns results)
- [ ] User authentication works (if applicable)
- [ ] Automatic backups configured
- [ ] PM2 set to start on boot
- [ ] Cloudflared service set to start on boot
- [ ] Railway/Vercel projects deleted

---

## Cost Summary

### Before Migration:
- Railway: $5-10/month
- Vercel: $20/month
- **Total: $25-30/month = $300-360/year**

### After Migration:
- Oracle Cloud: $0/month (forever)
- Cloudflare: $0/month
- Domain: $12/year
- **Total: $12/year**

### Annual Savings: $288-348 💰

---

## Support & Resources

### Oracle Cloud Documentation:
- Free Tier: https://www.oracle.com/cloud/free/
- Compute Docs: https://docs.oracle.com/iaas/Content/Compute/home.htm

### Cloudflare Documentation:
- Tunnel Setup: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- DNS Setup: https://developers.cloudflare.com/dns/

### Community Help:
- Oracle Cloud Free Tier Subreddit: r/oraclecloud
- Cloudflare Community: https://community.cloudflare.com/

---

## Next Steps

1. ✅ Follow this guide step by step
2. ✅ Test everything thoroughly
3. ✅ Set up monitoring and backups
4. ✅ Delete old Railway/Vercel projects
5. ✅ Set up AI search integration (Part 2 - next guide!)

---

**Congratulations!** You now have a professional, production-grade hosting setup that costs $0/month! 🎉

Your Islamic Nexus app is now running on:
- Enterprise-grade infrastructure (Oracle Cloud)
- With automatic HTTPS and DDoS protection (Cloudflare)
- With 24GB RAM and 4 CPU cores
- Completely FREE forever!

**May Allah accept this work and make it a source of continuous reward (Sadaqah Jariyah) for you!** 🤲
