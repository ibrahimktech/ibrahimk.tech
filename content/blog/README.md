# Blog

One `.md` file per post. Each becomes a page at `/blog/<file-name>`, shows on `/blog` and the home page, and goes into the RSS feed.

Images for posts go **in this folder too**, next to the `.md` files.

## Write a post

1. Copy `_template.md` and rename the copy, e.g. `my-first-robot.md`.
   The name becomes the address `/blog/my-first-robot`, so use lowercase letters, numbers and dashes.
2. Fill in `title`, `date` and `description` at the top.
3. Write the post below the second `---`.
4. Keep `draft: true` while writing. You'll see it at http://localhost:3000/blog with a DRAFT badge.
5. When it's ready, set `draft: false`, commit and push.

## The settings

| Field         | Required? | Example                            |
| ------------- | --------- | ---------------------------------- |
| `title`       | yes       | `"How I built a robot arm"`        |
| `date`        | yes       | `2026-11-10`                       |
| `description` | yes       | `"One or two sentences."`          |
| `draft`       | yes       | `true` or `false`                  |
| `cover`       | no        | `"robot-arm.jpg"` (in this folder) |

## Formatting cheat sheet

```md
## Heading
### Smaller heading

Paragraph. **bold** _italic_ `code` [link](https://example.com)

- bullet
1. numbered

> a quote

![what the image shows](photo.jpg)
```

## Images

1. Put the image in this folder (or a subfolder, e.g. `robot-trip/photo-1.jpg`).
2. Write this on its own line where it should appear:

   ```md
   ![What the photo shows](photo-1.jpg)
   ```

3. Want a caption under it? Add it in quotes:

   ```md
   ![The arm lifting a cup](photo-1.jpg "First successful lift, after two weeks of tuning")
   ```

- The text in `[ ]` describes the image for blind readers and Google. Always fill it in.
- Phone photos are fine at full size. The site resizes them automatically and serves small, fast versions.
- Use file names without spaces: `robot-arm.jpg`, not `robot arm.jpg`.
- A wrong file name shows an error telling you which image is missing.
- `cover:` at the top is different: it's the preview image used when the post is shared on social media.

## Code blocks

For a code block, put three backticks and the language (`py`, `ts`, `js`, `bash`, `cpp`…) on one line, the code, then three backticks.

## Drafts

`draft: true` posts are visible only on your computer. On the live site they don't exist: not on the blog, not in the sitemap or RSS, and the address returns "page not found".
