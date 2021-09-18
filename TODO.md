version 0.0.1

- listen a single file, if changed th web page will reload

version 0.0.3

- resources/static server :white_check_mark:, but there are questions

version 0.0.4

- fix errors in 0.0.3

version 0.0.6

- add commitlint for project, use travis to test and deploy

version 0.0.7

- use typescript refactor project, add assets change listen

TODO: 

- refresh part of resources instead of wholepage
- listen more than a file:white_check_mark:
- XMLHttpRequest/fetch cors
- use  typescript and build tool, it seems that the package is little big
  - feel sick about so many \<any>
  - inject.html should be put in src, but can tsc do copy assets? don't want to use rollup yet
  - when code in .ts like import a ts file, after compile the import is still a ts file(should be js)
- resources/static server :white_check_mark:
  - new question: How to map the path of the website resources to the appropriate local file path:white_check_mark:
  - shorthand: can't show real-time resources when resources change on serving
  - shorthand: now must give absolute resource path:white_check_mark:

Basic:
  - git commit format:white_check_mark:
  - test
  - ci:white_check_mark:
