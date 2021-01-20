---
id: updateReason
title: UpdateReason
sidebar_label: UpdateReason
---

```ts
interface UpdateReason {
  name: string;
  type: UpdateType;
}

type UpdateType = 'value' | 'error' | 'props' | 'context';
```
