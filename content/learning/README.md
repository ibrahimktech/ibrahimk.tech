# Learning

One `.md` file per course, book, video or anything else you learn from. Each one becomes a card on `/learning`. The newest three also show on the home page.

## Add something

1. Copy `_template.md` and rename the copy, e.g. `atomic-habits.md` (any name works, it's not shown anywhere).
2. Fill in the settings at the top.
3. Below the second `---`, write your takeaways. Usually a short list:

   ```md
   - Habits are easier to start when they're tiny.
   - Environment beats willpower.
   ```

4. Set `draft: false` to publish.

## The settings

| Field    | Required? | Example                                              |
| -------- | --------- | ---------------------------------------------------- |
| `title`  | yes       | `"Atomic Habits"`                                    |
| `kind`   | yes       | `course`, `book`, `video`, `article`, `talk`, `podcast`, `note` |
| `date`   | yes       | `2026-11-10`                                         |
| `status` | yes       | `in-progress` (under "Now") or `done` (under "Finished") |
| `draft`  | yes       | `true` or `false`                                    |
| `source` | no        | `"James Clear"`                                      |
| `url`    | no        | `"https://jamesclear.com/atomic-habits"`             |

When you finish something, change `status` to `done` and update `date` to the day you finished.

For longer thoughts, write a blog post in `content/blog/`.
