# Image Studio

**Image Studio** is an Obsidian desktop plugin (translated and adapted from `image-embed-kit`) for resizing embedded images with side drag handles, zooming and panning in an interactive preview modal, managing image files directly from a note, and saving captions in Markdown.

> **Note:** If you also have `image-embed-kit` installed in the same vault, disable one of them in **Settings → Community plugins** so two hover overlays don't appear at the same time.

---

## 1. Hover Overlay & Toolbar

When you hover over (or select) an embedded local image in **Live Preview** or **Reading View**, Image Studio shows an accent outline, left/right resize grips, and a floating toolbar in the top-right corner of the image:

| Control | Action |
|---|---|
| **Left / Right side grips** | Drag horizontally to resize the image width (displays live `px` badge). |
| **Zoom** (`zoom-in` icon) | Opens the interactive Zoom & Pan lightbox modal. |
| **Edit width & caption** (`captions` icon) | Opens the **Image properties** modal. |
| **Edit this block** (`code` / block icon) | Switches the embed block to raw Markdown editing in Live Preview. |
| **Image tools** (`more-horizontal` / `...` icon) | Opens the file & link actions menu (Copy, Replace, Rename, Reset size, Open, Remove, Delete). |

---

## 2. Resizing Images

You can resize any local image (`![[image.png]]` or `![alt](image.png)`) in three ways:

1. **Drag the side grips:** Grab either the left or right handle on the image outline and drag. A live pixel badge (`e.g. 420 px`) appears at the bottom while dragging, and releasing saves the width directly into your Markdown link (`![[image.png|420]]`).
2. **Keyboard on the grip:** Focus a left/right grip and press `ArrowLeft` or `ArrowRight` to adjust the width in **10 px** increments.
3. **Properties modal:** Click **Edit width & caption** (or run **Current image properties**) and enter a **Display width (px)** between `32` and `8192` px. Leave it empty (`Auto`) to revert to the note's default size.

To clear a custom width at any time, open **Image tools (`...`) → Reset size**.

---

## 3. Captions & Caption Styling

### How captions are stored in Markdown

Image Studio stores captions directly in your Markdown note right after the image link using a clean `<span class="caption">` tag (so Obsidian renders it cleanly in both Live Preview and Reading View without any HTML comment clutter, and you can style `.caption` directly with CSS):

- **Visible caption:**
  ```markdown
  ![[screenshot.png|500]]

  <span class="caption">My image caption</span>
  ```
  (On block-level images it places a blank line before the caption; inline images use a single space.)

- **Hidden caption (kept in note, hidden from rendered view):**
  If you check **"Keep caption text in note but hide from view"** in the Image properties modal, Image Studio adds the `caption-hidden` class so the plugin's built-in CSS hides it (`display: none`) while keeping the text in your note:
  ```markdown
  ![[screenshot.png|500]]

  <span class="caption caption-hidden">My image caption</span>
  ```

*(Legacy `*caption* <!--iek-caption-->` and `<!--iek-caption-hidden:...-->` markers are also still recognized and automatically upgraded when edited.)*

### Rules & limits
- Captions must be a **single line** (up to **1,000 characters**).
- HTML characters (`&`, `<`, `>`) are automatically escaped when written and unescaped when edited in the modal.

### Built-in & custom CSS styling

Image Studio's `styles.css` bakes in default `.caption` styling (centered, `0.9em`, italic, muted text) and `.caption.caption-hidden { display: none; }`. You can override or extend `.caption` in any CSS snippet:

```css
/* Example: customize Image Studio captions in your own CSS snippet */
.caption {
  font-size: 0.85em;
  color: var(--text-accent);
  font-style: normal;
}
```

---

## 4. Interactive Zoom & Pan Lightbox

Click the **Zoom** button on the image toolbar (or click **Zoom** inside the Image properties modal) to open the full-screen preview modal:

- **Zoom in / out:**
  - Use `Ctrl + Scroll Wheel` (Windows/Linux) or `Cmd + Scroll Wheel` (macOS).
  - Click the **Zoom in** / **Zoom out** buttons in the bottom bar.
  - Press `+` / `=` to zoom in, `-` to zoom out.
- **100% & Fit to screen:**
  - Click **100%** to view at native pixel size (`1:1`).
  - Click **Fit to screen** (or press `0`) to fit the image inside the modal.
- **Pan:** When zoomed in larger than the viewport, scroll or drag scrollbars inside the stage to pan around the image.
- **Status bar:** Displays the image's natural dimensions and current zoom percentage (e.g., `1920 × 1080 px · 100%`).

---

## 5. Image File & Link Management

Open **Image tools (`...`)** on any image to access:

- **Copy image:** Copies the image as PNG to your system clipboard.
- **Replace file...:** Opens a vault picker to swap the current image link with another image in your vault (preserving width/alt).
- **Rename:** Renames the underlying image file in your vault (and Obsidian updates links automatically).
- **Reset size:** Removes the `|width` parameter from the image link.
- **Open in new tab / Open to the right:** Opens the image file itself in a new Obsidian tab or split pane.
- **Remove from note:** Removes the image embed from the Markdown note without deleting the file.
- **Delete image:** Prompts to delete the image file from your vault and cleans up the link in the note.

---

## 6. Command Palette & Shortcuts

- **Image Studio: Current image properties** — Opens the width & caption modal for the image under your cursor.
- **Image Studio: Pick image in note** — Lists all local images in the active note (searchable by filename, caption, or line number) so you can jump straight to editing any image.
- **While an image is selected (overlay active):**
  - `Delete`: Prompts to delete the image file and remove the link.
  - `Enter` (in Live Preview): Inserts a new line below the image (and its caption) so you can keep typing cleanly.

---

## Credits & License

**Image Studio** is a translated and adapted fork of **Image Embed Kit** by [visitor17564](https://github.com/visitor17564) ([GitHub](https://github.com/visitor17564/image-embed-kit)), an MIT-licensed Obsidian plugin. This project:

- keeps the original MIT copyright notice and permission notice in [LICENSE](LICENSE) (upstream copyright: © 2026 visitor17564),
- adds the fork's own copyright line below it,
- and lists its feature differences over the original (zoom & pan lightbox, image file management) in the README above.

Distributed under the MIT License — see [LICENSE](LICENSE) for the full text.
