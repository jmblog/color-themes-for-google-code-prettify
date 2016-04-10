# Contributing guidelines

Your contribution is always welcome! If you create a new nice theme, find a bug or propose an improvement, send me a pull request.

1. Fork this repo, clone your fork and configure the remotes:

  ```bash
  # Clone your fork of the repo into the current directory
  git clone https://github.com/<your-username>/color-themes-for-google-code-prettify
  # Move to the newly cloned directory
  cd color-themes-for-google-code-prettify
  # Assign the original repo to a remote called "upstream"
  git remote add upstream https://github.com/jmblog/color-themes-for-google-code-prettify
  ```

2. If you cloned a while ago, get the latest changes from upstream:

  ```bash
  git checkout master
  git pull upstream master
  ```

3. Create a new topic branch (off the latest version of `master`) to contain your feature, change, or fix:

  ```bash
  git checkout -b <topic-branch-name>
  ```

4. Install dependencies:

  ```bash
  npm install
  ```

5. Run local server:

  ```bash
  npm start
  ```

## Adding a new theme

1. Append data to `src/themes.json`.
2. Create your theme stylesheet with Sass
  - Put it into `src/themes/<your-theme-id>.scss`
3. Create a scss file for preview
  - Put it into `src/styles/theme-previews/<your-theme-id>.scss`

Please refer to existing scss files in details.
