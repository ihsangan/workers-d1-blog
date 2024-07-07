# workers-d1-blog
https://blog.isan.eu.org/
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ihsangan/workers-d1-blog)
```sql
DROP TABLE IF EXISTS blog_post;
CREATE TABLE IF NOT EXISTS blog_posts (
    title TEXT,
    url TEXT PRIMARY KEY,
    time INTEGER,
    content TEXT
);
```
