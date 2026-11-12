# Projects

One `.md` file per project. Each one becomes:

- a card on `/projects` (and on the home page if `featured: true`)
- its own page at `/projects/<file-name>`, with everything you write below the settings

Images for projects go **in this folder too**, next to the `.md` files.

## Add a project

1. Copy `_template.md` and rename the copy, e.g. `robot-arm.md`.
   The name becomes the address `/projects/robot-arm`, so use lowercase letters, numbers and dashes.
2. Fill in the settings at the top (the template explains each one).
3. Write about the project below the second `---`.
4. Optional: drop an image in this folder and write its name in `image:`.
5. Keep `draft: true` while you work on it. You'll see it at http://localhost:3000/projects with a DRAFT badge.
6. When ready, set `draft: false`, commit and push.

## The settings

| Field         | Required? | Example                          |
| ------------- | --------- | -------------------------------- |
| `name`        | yes       | `"Robot Arm"`                    |
| `description` | yes       | `"A 6-axis arm I built from…"`   |
| `status`      | yes       | `live`, `building` or `archived` |
| `draft`       | yes       | `true` or `false`                |
| `url`         | no        | `"https://example.com"`          |
| `image`       | no        | `"robot-arm.png"` (in this folder) |
| `imageAlt`    | if image  | `"The arm picking up a cup"`     |
| `tags`        | no        | `[Hardware, Robotics]`           |
| `metric`      | no        | `"1,200 students"` (real numbers only) |
| `featured`    | no        | `true` to show on the home page  |
| `order`       | no        | `1` (lower = first)              |

If something is wrong (a typo in a field name, a missing image, `status: done`…), the page shows an error saying which file and what to fix.

## Writing the project page

Below the settings, write normal Markdown:

```md
## A heading

A paragraph. **Bold**, _italic_, [a link](https://example.com).

- a list
- of things

![What the photo shows](photo-in-this-folder.jpg)
```

Text between `<!--` and `-->` is a note to yourself and never shows on the site.

## Images in the project page

The `image:` setting is the small square picture on the card. For photos *inside* the page (build steps, screenshots, the finished robot…):

1. Put them in this folder. With many photos, give the project its own subfolder, e.g. `robot-arm/step-1.jpg`.
2. Write this on its own line where the photo should appear:

   ```md
   ![What the photo shows](robot-arm/step-1.jpg)
   ```

3. Add a caption in quotes if you want one:

   ```md
   ![The base, printed in PLA](robot-arm/step-1.jpg "Step 1: the base took 9 hours to print")
   ```

- Always describe the photo inside `[ ]`. It's read aloud to blind visitors and used by Google.
- Phone photos are fine at full size. The site resizes them and serves small, fast versions automatically.
- Use file names without spaces: `step-1.jpg`, not `step 1.jpg`.
- A wrong file name shows an error naming the missing image.
