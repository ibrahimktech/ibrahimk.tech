# Content

Everything written on ibrahimk.tech lives in this folder. You never need to touch the code to update the site.

| Folder      | What it is                         | Shows up on                       |
| ----------- | ---------------------------------- | --------------------------------- |
| `blog/`     | Blog posts, one file per post      | `/blog`, `/blog/<name>`, home     |
| `projects/` | Projects, one file per project     | `/projects`, `/projects/<name>`, home |
| `learning/` | Courses, books, videos you learned from | `/learning`, home            |
| `about/`    | Your name, intro and About page    | `/about`, home, every page title  |
| `links/`    | Email and social links             | footer, home, `/about`            |

Each folder has its own `README.md` with step-by-step instructions, and the folders where you add things have a `_template.md` to copy.

## How every file works

Each `.md` file has two parts:

```md
---
title: "Settings go between the two --- lines"
draft: true
---

Everything below is normal text (Markdown).
```

## Rules

- **Files starting with `_` and `README.md` files are never published.** That's how templates and these notes stay off the site.
- **Images go next to the `.md` file that uses them.** Write just the file name (`image: "robot.png"`), never a path like `C:\Users\...`. Inside the text of a post or project page, add one with `![what it shows](robot.png)`, or `![what it shows](robot.png "a caption")`. Big phone photos are fine because they're resized automatically. Details are in the `blog/` and `projects/` READMEs.
- **`draft: true`** means only you can see it, while running `npm run dev`. **`draft: false`** means it goes live on the next push.
- **Mistakes don't reach the live site.** A typo in a setting, a missing image or a wrong value shows an error naming the file and what to fix, and the build stops.

## Publishing

1. Run `npm run dev` and check your change at http://localhost:3000 (refresh the page after saving).
2. Commit and push to `main`. Vercel deploys it in a minute or two.
