# react-use-fetch-with-redux

React hook to fetch/select data with simple caching

## This hook is for you if you...

- Want to feed a component data from Redux ✅
- Don't want to make API calls if you already have the data ✅
- Love hooks ✅

## Installation

With NPM:

```bash
npm i --save react-use-fetch-with-redux
```

With Yarn:

```bash
yarn add react-use-fetch-with-redux
```

## Usage

You can create your own hook that uses `useFetchWithRedux` to grab data (if needed) and pass it from the Redux store to your components:

**In `useThing.ts`**

```typescript
import { useFetchWithRedux } from 'react-use-fetch-with-redux';
import { getThingStart } from './actions/ThingActions'; // getThingStart is an action creator.
import { getThingSelector } from './selectors/ThingSelector'; // getThingSelector is a selector.

const useThing = () => useFetchWithRedux(getThingsStart, getThingSelector);

export { useThing };
```

For completeness, this is what `getThingSelector` could look like:

**In `./selectors/ThingSelector.ts`**

```typescript
import { State } from './types'; // This is the Redux Store type

const getThingSelector = (state: State) => state.thing;

export { getThingSelector };
```

Finally, piecing it all together, we can now elegantly use our hook in a component.

**In `SomeComponent.tsx`**

```tsx
import React from 'react';
import { useThing } from './useThing';
import { State, Thing } from './types';

const SomeComponent = () => {
  const thing = useThing<State, Thing>();
  const Loading = () => <span>Loading...</span>;

  return thing ? <Loading /> : <div>My thing: {thing}</div>;
};
```

## Testing

The project uses Jest for testing, along with [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library) for rendering hooks without explicitly creating harness components.

## Contributing

I welcome all contributions to this project. Please feel free to raise any issues or pull requests as you see fit :)
