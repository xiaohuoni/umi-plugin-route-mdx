# umi-plugin-route-mdx

Umi@4 Plugin For Route Support mdx。

## use

```bash
pnpm i umi-plugin-route-mdx
```

```ts
import { defineConfig } from "umi";

export default defineConfig({
  plugins: [require.resolve("umi-plugin-route-mdx")],
});
```

## dark theme

```js
document.documentElement.classList.toggle("dark", true);
```
