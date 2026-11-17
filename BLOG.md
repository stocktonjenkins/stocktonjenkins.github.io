# Blog

Posts live in Firebase: Firestore holds the posts, Cloud Storage holds the images, and Firebase Auth handles sign-in with Google. The site itself stays on GitHub Pages, and publishing goes live immediately with no rebuild.

| Route | What |
|---|---|
| `/blog` | Published posts, with a tag filter |
| `/blog/:slug` | Reader: sidenotes in the margin, numbered references, reading progress bar |
| `/write` | Your drafts and published posts (admin only) |
| `/write/:id` | Notion-style editor with autosave |
| `/write/:id/preview` | Preview a draft exactly as readers will see it |

## One-time setup

1. **Create a Firebase project** at https://console.firebase.google.com.
   - Upgrade it to the **Blaze** plan. Cloud Storage (used for images) has required Blaze since Feb 2026. Usage under 5 GB stays free, but set a budget alert anyway.
2. **Add a Web app**: Project settings → Your apps → `</>`. Copy the config values.
3. **Enable the products**:
   - **Authentication** → Sign-in method → enable **Google**. Under Settings → Authorized domains, add `stocktonjenkins.github.io`.
   - **Firestore Database** → Create database (production mode).
   - **Storage** → Get started.
4. **Configure the app**: `cp .env.example .env.local`, then fill in the values. `.env.local` is git-ignored. The values are baked into the build, so `npm run deploy` must run on a machine that has this file.
5. **Find your UID**: run `npm start`, open http://localhost:3000/write, and sign in with Google. The page shows your UID.
   - Put it in `.env.local` as `REACT_APP_BLOG_ADMIN_UID`.
   - Replace both `ADMIN_UID` placeholders in `firestore.rules` and `storage.rules`.
6. **Deploy the security rules**. Either paste them into the console (Firestore → Rules, Storage → Rules), or run:
   ```sh
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules,storage --project <your-project-id>
   ```
   The rules are the real security boundary. The admin check in the UI only hides buttons.
7. Restart `npm start`. Then `npm run deploy` to publish the site.

## Writing

- **`/`** opens the block menu: headings, lists, tables, images (upload or paste), code, equations, callouts, citations, sidenotes.
- **Drag** blocks by the ⋮⋮ handle. **Select text** to get the formatting toolbar.
- **Math**: use `/Block Equation` for a display equation, or `/Inline Equation`. Click any formula to edit its LaTeX.
- **Code**: use `/Code block`, then pick a language in the block's corner. Python is the default.
- **Citations**: paste BibTeX (from Google Scholar, arXiv, DBLP, or ACL Anthology) into the References panel under the post. Then type `@` in the text and pick a reference. Numbers follow first-citation order. Readers get a bibliography with links.
- **Sidenotes**: use `/Sidenote` and click the marker to write the note. On wide screens readers see it in the margin; on phones it appears in a Notes list at the end.
- **Autosave** runs about a second after you stop typing. `⌘S` saves immediately.
- **Settings** (top right): URL slug, tags, delete. **Publish** picks a slug from the title if you haven't set one.

## Series

Group posts about one ongoing project under a single umbrella.

- **Create / assign**: in a post's **Settings → Series**, pick a series or choose "New series…". **Order** is optional: leave it on auto to order parts by publish date, or give numbers to pin an order.
- **Privacy**: a series is private until one of its posts is published. Until then its title and description can't be read by anyone but you (enforced by `firestore.rules`). Publishing, unpublishing, deleting or moving a post updates this automatically.
- **Readers see**:
  - a "Part n of m" box above each post, listing every part;
  - previous/next links at the end of the post;
  - a page per series at `/blog/series/<slug>`;
  - series cards on `/blog`.
- **Part numbers** count published posts only, so drafts never leave gaps.
- **Manage** titles, descriptions and Ongoing/Complete status in the **Series** section of `/write`. You can delete a series once it has no posts.

## Search, views, AI

- **Search** (`/blog`): a keyword search box ranks posts with BM25, an IDF-weighted score. Title and tag matches count more than body matches. The last word also matches as a prefix, so results update while you type. Search combines with the tag filter, and both are kept in the URL (`?q=…&tag=…`).
- **Views**: each reader browser counts once per post per day. Your own visits while signed in don't count. Totals appear on `/write`. The rules let anyone add exactly +1 to `views` on a published post and nothing else, so counts can be inflated deliberately but nothing else can be changed.
- **Gemini** (Settings → Gemini): your API key is stored in Firestore at `config/ai`, which only the admin can read. It is never in the site bundle.
  - On first publish, Gemini fills in an empty summary and empty tags.
  - **Generate** and **Suggest tags** in Settings re-run it. Suggested tags reuse your existing tags where they fit.
  - Summaries appear on `/blog` with a "TL;DR" label in front. Hovering over an AI-written one says it came from Gemini.
- **Knowledge base**: `~/src/second-brain/.system/connectors/blog-export/run.sh` copies published posts to `kb/Resources/Blog/` as Markdown. See the README next to it.

## Files

- `src/blog/schema.tsx`: editor schema, including the custom citation, sidenote, and callout nodes
- `src/blog/PostEditor.tsx`: editor page
- `src/blog/PostView.tsx`: reader, with sidenote layout and bibliography
- `src/blog/BlogIndex.tsx`: post list, search and tag filter
- `src/blog/posts.ts`: Firestore and Storage access
- `src/blog/highlighter.ts`: Shiki syntax highlighting. It uses raw grammars because CRA can't parse the precompiled ones.
- `src/blog/blog.css`: all blog styling, built on the homepage's tokens
- `firestore.rules`, `storage.rules`: access control

## Known limits

- **Search engines**: GitHub Pages serves `/blog/<slug>` through `404.html` (an SPA fallback), so crawlers get a 404 status and an empty shell. Readers who follow a link are unaffected. Fixing SEO properly needs prerendering or a host with rewrites.
- **Sidenote formatting**: sidenotes are plain text, with no links or formatting inside them yet.
- **Slug changes**: changing a published post's slug breaks old links.
