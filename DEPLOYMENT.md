# Liberty Point Capital deployment

## Apache

Point the virtual host document root at `public/`, enable `mod_rewrite`, and deny direct access to application directories:

```apache
DocumentRoot /var/www/liberty-point-capital/public
<Directory /var/www/liberty-point-capital/public>
    AllowOverride All
    Require all granted
</Directory>
```

Create a least-privilege MySQL user and apply migrations in this order:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p hana_eunhaeng < database/schema-extended.sql
mysql -u root -p hana_eunhaeng < database/pension.sql
mysql -u root -p hana_eunhaeng < database/trading.sql
mysql -u root -p hana_eunhaeng < database/security.sql
```

Copy `.env.example` to the hosting environment and provide secrets outside the web root. Never commit production credentials.

## Nginx

```nginx
root /var/www/liberty-point-capital/public;
index index.php;
location / { try_files $uri $uri/ /index.php?$query_string; }
location ~ \\.php$ {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;
}
location ~ ^/(config|core|controllers|helpers|middleware|models|views|database)/ { deny all; }
```

Before launch, enable HTTPS, rotate the demo credentials, disable error display, configure backups, and verify the audit table and database user permissions. Trading remains paper-only until a regulated execution integration is approved.
