# sql-performance-explained

This is a little code-along exercise as I read through <https://use-the-index-luke.com/>.

The idea is to dump the output of `lsof` (and maybe others?) into a database which can
then be indexed, queried, etc. This will probably not be the "prettiest" code and I hope
to not introduce any external dependencies while I get familiar with <https://bun.sh/>.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
