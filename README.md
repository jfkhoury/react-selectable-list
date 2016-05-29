
# YepSelectableList

A list of react components that can be selected, activated and navigated.
You can use the keyboard's up/down arrows to select items, and hit enter to activate them.

Each selected item will be flagged as `visited` once you navigate away from it. Keep reading to find out how to style those visited items.

## Optional hooks: `onSelect` and `onActivate`

Your list items can expose `onSelect` or `onActivate` as props and the list will call you back.

```js
    ...
    return <Number id={item.id} onSelect={() => console.log("I am selected!")} />
```

## Required props: `id`

Your list items must have an `id` prop. If you really don't have an `id`, use the index as id.

```js
    // Items without ids:
    var list = ["one", "two", "three"].map((item, index) => {
        return <Number id={index} />
    });

    // or Items with ids:
    var list = [{ title: "Test 1", id: 123 }].map((item) => {
        return <Number id={item.id} />
    });
```

## Populating the list

The YepSelectableList will wrap it's children with selectable list items.

Here's how you can populate it:

```
    <YepSelectableList isSelectionBarEnabled={true}>
        <SearchResult />
        <SearchResult />
        <SearchResult />
        <SearchResult />
    </YepSelectableList>
```

## Options (or "props")

```
    activeItemId: "IdOfActiveItem" : null by default
    isSelectionBarEnabled: true/false : false by default
    selectionBarPosition: "top" / "bottom" : "top" by default
    isNavigationDisabled: true/false, prevent navigation after selecting an option (by next/prev or keystroke), false by default
    emptyUI: You can provide an empty React component that will be rendered in case the list is empty
```

The selection bar contains 2 buttons: Next and Previous, which can be used to navigate the selectable list items.

TODO Allow styling those buttons.

## Empty UI

You can provide the selectable list with a custom React component to be rendered in case the list was empty. If you don't provide anything,
nothing will be rendered.

e.g
```
    <YepSelectableList emptyUI={this.emptyList}>
    </YepSelectableList>

    emptyList() {
        return <div>No results found!</div>
    }
``

## Disabled list items

To add a disabled list item, which is an item that cannot be selected, set an `isDisabled` prop on the React component that is being added to the List's data source.

e.g
```js
    var listDataSource = [];
    listDataSource.push(<AnnotationItem {...data} />);
    .
    .
    .
    listDataSource.push(<Chapter chapterTitle={chapter.title} isDisabled={true} />);
```

## Styles

Each list item can have one of those 4 styles: --is-selected, --is-active, --is-visited or :hover

### Visited, Selected or Active items

Here's how you can style those states when implementing the YepSelectableList:

e.g
```Sass
    .search-results {
        .ysl {
            &__item {
                &--is-active {
                    background: yellow;
                }

                &--is-selected {
                    color: brown;
                }
            }
        }
    }
```

### Hover
Hover background is `$clr-gray-3` by default. You can simply add a hover style to the list item to override it.

e.g
```Sass
.ysl {
    &__item {
        &:hover {
            background: pink;
        }
    }
}
```
