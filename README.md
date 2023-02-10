# umi-plugin-route-mdx

Umi@4 Plugin For Route Support mdx。

![image](https://user-images.githubusercontent.com/11746742/217989434-1e382941-3173-4f5a-97be-46ddf362fe33.png)
[about.mdx](./demo/src/pages/about/index.mdx)
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
