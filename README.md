Pihanga - Framework for dynamically extendible React apps
===

> [pihanga](https://s3.amazonaws.com/media.tewhanake.maori.nz/dictionary/38608.mp3)
>  (noun) window, sliding slab of the traditional window of a wharenui.

Motivation
---

Most of the web frontends we are usually building are for a rather small user base to better use or maintain rather complex backends. Many of those systems start out small but over time expand in various directions by different teams using different technologies. Most likely a common scenario for many business support services.

We use micro services and similar technologies to avoid any unnecessary dependencies in the backend, but our users, understandably want a unified UX on the frontend.

This project is an attempt to achieve that while supporting the independent development of the various parts and components surfacing specific backend capabilites. In other words, we want to minimize the amount of code changes when adding new functionality while still supporting an integrated UX experience.

Let me explain that with a trivial example. Let us assume we just delivered an internal car booking service for a company. After a successful launch a different part of the business in charge of managing the truck fleet wants to add their service to it, as well. Their backend is very different and the original frontend team has already been dissolved. We want to make it easy for the "truck" team to independently develop the truck specific UX components as well as extension points to existing generic functionality, such as search, without needing to modify the car components. Frontend integration should be as simple as adding an additional script link to the index page.

Approach
---

We have found the React/Redux approach to be extremely useful in managing dependencies between UX components and cleanly separating state synchronisation between front- and backend. In addition, a purely functional approach to component design not only leads to much cleaner code, but also simplifies testing considerably. We can visualize this as:

![Standard Redux](doc/standard-redux.png)


With the positive lessons learned from defining a web page as pure functions over a single state structure, we wanted to see if we can push this further and essentially derive the above function _ui()_ itself as the result of another function over the _UX_ state object.

In order to do that, we need to define a _construction_ model for a web page. In _Pihanga_, like in other frameworks, a page is composed of hierarchically nested **cards**. Or, in other words, a _tree of cards_ with the root of the tree being the entire page frame. Each card can contain normal web components as well as other cards. Current practice will not only select the card
to be embedded in another card, but also declare all it's properties. For instance:

```
export const FooCard = (props) ==> {
  ...
  return {
    <>
      ...
      <BooCard p1={...} p2={...} ... />
      ...
    </>
  }
}
```

And that's where _Pihanga_ departs from current practice. Instead of a declaring the exact card to embed, we employ a _late binding_ approach, where the embedded card is only identified by a locally unique identifier. The same code
segment as above in _Pihanga_ looks like:

```
export const FooCard = (props) ==> {
  ...
  return {
    <>
      ...
      <Card cardName="Boo" />
      ...
    </>
  }
}
```
where `Card` is essentially a placeholder for a _Pihanaga component_ defined separately.

The _Pihanga_ state structure, different to the _Redux state tree_, is a map between the `cardName` of a card and it's associated property list. In addition, the values in that property list can be queries (currently functions) over the entire _Pihanga_ state (all other cards) as well as the _Redux_ state.

Let's demonstrate that on a simple app consisting of a frame-filling `page` card which will show one of two listing cards depending on the `showList` property in the Redux state which is expected to either contain `cars` or `trucks`.

The _Pihanga_ state structure is defined as follows:

```javascript
export default {
  page: {
    cardType: 'AppPage',
    title: 'Transportation Service',
    subTitle: (_, ref) => ref('.', 'contentCard', 'title'),
    contentCard: (state) => state.showList,
    //...
  },
  cars: {
    cardType: 'PiTable',
    title: 'Cars',
    //...
  },
  trucks: {
    cardType: 'PiTable',
    title: 'Trucks',
    //...
  },
}
```

and the `AppPage` card is implemented as follows: 

```javascript
import { Card } from '@pihanga/core';

export const AppPageCard = ({
  title,
  subTitle,
  contentCard,
  //...
}) => {
  return (
    <div>
      ...
      <Card cardName={contentCard} />
      ...
    </div>
  );
};
```
In this simple example the mapping between `<Card cardName={contentCard} />` and the actual card embedded is determined by the 
value bound to the `contentCard` property of of the _Pihanga state_ of the card (`page`) embedding it. That value can either be a
constant (`title: 'Cars'`), a reference to the property value of another card (`... => ref('.', 'contentCard', 'title')`), or a function on the current _Redux_ state (`... => state.showList`).

Simply changing the value of `showList` to a different value, will not only change what card is being embedded inside `AppPageCard`, but also the `subTitle` that card is displaying. Beside the dynamic nature of this approach, we can now also
develop 'template' cards which can dynamically be adapted to various different uses __without__ having to change their internals.

## Further Reading

The [examples](./examples) directory contains various examples on how _Pihanga_ can be used to quickly develop useful and scalable web applications. See the _README_ files in the various sub directories for more information.

The 

## Developer Notes

### Pulishing new release

    lerna version prerelease
    lerna publish from-git
