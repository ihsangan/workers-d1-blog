# Cloudflare Workers D1 Blog
## Getting started
Click the deploy button and follow the instructions

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ihsangan/workers-d1-blog)
- Setting up `wrangler.toml` file for D1 binding and other site informations.

copy SQL command bellow
```sql
CREATE TABLE IF NOT EXISTS blog_posts (
    title TEXT NOT NULL,
    url TEXT PRIMARY KEY NOT NULL UNIQUE,
    time INTEGER,
    content TEXT
);
```
Open [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers/d1) , select (or create) database, go to console section and execute command, Check whether the table has been created in the tables section.

Copy db name and ID and adjust to `wrangler.toml`
- setup login info for create and editing articles

Go to repository setting > secrets and variables > actions

Create repository secrets with name `USERNAME` & `PASSWORD`
## Usage

### Endpoints

- **Home (`/`)**
  - Displays the list of blog posts.

- **Create New Post (`/new`)**
  - Displays the form to create a new blog post. Requires basic authentication.

- **Create Post (`/create`)**
  - Handles form submission to create a new post. Requires basic authentication.

- **Read Post (`/post/:article`)**
  - Displays a specific blog post.

- **Edit Post (`/edit/:article`)**
  - Displays the form to edit a blog post. Handles form submission to update or delete the post. Requires basic authentication.
## Troubleshooting

![chrome_screenshot_7 Jul 2024 17 19 30](https://github.com/ihsangan/workers-d1-blog/assets/63774886/dae5be14-07a4-491a-bbd7-7145cacdda4e)

If you get error like this just simply Re-run job
