import React from "react";
import { autobind } from "core-decorators";
import _ from "underscore";
import ListItem from "./ListItem";
import SelectionBar from "./SelectionBar";

const KEY_CODES = { UP: 38, DOWN: 40, ENTER: 13 };

function noop() {}

export default class YepSelectableList extends React.Component {
    constructor(props) {
        super(props);

        this.state = { selectedItemId: null, selectedIndex: null };

        // If a selection has not occured, disable key buttons nav.
        this.keyboarding = this._execIfHasSelection(this._keyboarding);
        this.selectNext = this._execIfHasSelection(this._selectNext);
        this.selectPrevious = this._execIfHasSelection(this._selectPrevious);

        this.selectionBarPosition = this.props.selectionBarPosition || "top";

        this._visitedItemIds = [];
    }

    componentDidMount() {
        document.body.addEventListener("keydown", this.keyboarding);
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.keyboarding);
        this.setState({ selectedItemId: null, selectedIndex: null });
    }

    render() {
        return (
            <div className="grid-block vertical">
                {(this.selectionBarPosition === "top") ? this.selectionBar : null}
                {this.length ? this.itemList : this.emptyList}
                {(this.selectionBarPosition === "bottom") ? this.selectionBar : null}
            </div>
        );
    }

    get selectionBar() {
        var canSelectNext = this._isNavigationEnabled ? this._canSelectIndex("next") : false;
        var canSelectPrevious = this._isNavigationEnabled ? this._canSelectIndex("previous") : false;

        return (this.props.isSelectionBarEnabled) ? (
            <SelectionBar
                isNextEnabled={canSelectNext}
                isPreviousEnabled={canSelectPrevious}
                onSelectNext={canSelectNext ? this.selectNext : noop}
                onSelectPrevious={canSelectPrevious ? this.selectPrevious : noop}
            />
        ) : null;
    }

    get emptyList() {
        return this.props.emptyUI || null;
    }

    get itemList() {
        return (
            <ul className="yep-selectable-list grid-block vertical">
                {React.Children.map(this.props.children, (item, index) => {
                    var id = item.props.id != null ? item.props.id : index;

                    return (
                        <ListItem
                            key={id}
                            onSelect={() => this.select(item, index)}
                            isActive={this._isActive(id)}
                            isSelected={this._isSelected(id)}
                            isDisabled={item.props.isDisabled}
                            hasBeenVisited={this._hasBeenVisited(id)}
                        >{item}</ListItem>
                    );
                })}
            </ul>
        );
    }

    get hasSelection() {
        return this.state.selectedIndex != null || this.props.activeItemId != null;
    }

    get length() {
        return React.Children.count(this.props.children);
    }

    get items() {
        return Array.isArray(this.props.children) ? this.props.children : [this.props.children];
    }

    @autobind
    select(item, selectedIndex) {
        var itemId = item.props.id;
        if (this._canItemBeSelected(item, itemId)) {
            if (_.isFunction(item.props.onSelect)) {
                item.props.onSelect(item);
            }

            this._setAsVisited(itemId);
            this.setState({ selectedItemId: itemId, selectedIndex });
        }
    }

    activate() {
        var itemToActivate = this._getItemAt(this.state.selectedIndex);
        if (itemToActivate && _.isFunction(itemToActivate.props.onActivate)) {
            itemToActivate.props.onActivate(itemToActivate);
        }
        this.setState({ selectedIndex: null, selectedItemId: null });
    }

    _execIfHasSelection(fn) {
        return (...args) => {
            if (this.hasSelection) {
                fn.apply(this, args);
            }
        };
    }

    _setAsVisited(itemId) {
        this._visitedItemIds.push(itemId);
    }

    _getSelectedIndex() {
        return this.state.selectedIndex != null ?
               this.state.selectedIndex :
               this._getIndexBy(this.props.activeItemId);
    }

    _selectNext() {
        if (this._isNavigationEnabled) {
            var lastItemIndex = this.length - 1;
            var selectedItemIndex = this._getSelectedIndex();

            while(selectedItemIndex < lastItemIndex) {
                var itemAtIndex = this._getItemAt(selectedItemIndex + 1);
                if (itemAtIndex.props.isDisabled || this._isActive(itemAtIndex.props.id)) {
                    selectedItemIndex++;
                    continue;
                }

                this.select(itemAtIndex, selectedItemIndex + 1);
                break;
            }
        }
    }

    _selectPrevious() {
        if (this._isNavigationEnabled) {
            var selectedItemIndex = this._getSelectedIndex();

            while(selectedItemIndex > 0) {
                var itemAtIndex = this._getItemAt(selectedItemIndex - 1);
                if (itemAtIndex.props.isDisabled || this._isActive(itemAtIndex.props.id)) {
                    selectedItemIndex--;
                    continue;
                }

                this.select(itemAtIndex, selectedItemIndex - 1);
                break;
            }
        }
    }

    _keyboarding(event) {
        switch(event.keyCode) {
        case KEY_CODES.UP:
            this.selectPrevious();
            break;
        case KEY_CODES.DOWN:
            this.selectNext();
            break;
        case KEY_CODES.ENTER:
            this.activate();
            break;
        default:
            break;
        }
    }

    _getItemAt(index) {
        return this.items[index];
    }

    _getIndexBy(itemId) {
        return this.items.indexOf(_.find(this.items, (item) => item.key === itemId));
    }

    _canSelectIndex(direction, selectedItemIndex = this.state.selectedIndex) {
        if (this.hasSelection) {
            var indexToSelect = direction === "next" ? selectedItemIndex + 1 : selectedItemIndex - 1;
            var itemAtIndex = this._getItemAt(indexToSelect);

            if (itemAtIndex) {
                return !itemAtIndex.props.isDisabled ? true : this._canSelectIndex(direction, indexToSelect);
            }
        }

        return false;
    }

    @autobind
    _isSelected(itemId) {
        return this.state.selectedItemId === itemId;
    }

    @autobind
    _hasBeenVisited(itemId) {
        return this._visitedItemIds.some(id => id === itemId);
    }

    @autobind
    _isActive(itemId) {
        var isActive = this.props.activeItemId === itemId;
        return isActive;
    }

    _canItemBeSelected(item, itemId) {
        return !item.props.isDisabled && itemId !== this.props.activeItemId && itemId !== this.state.selectedItemId;
    }

    get _isNavigationEnabled() {
        return (this.props.isNavigationDisabled !== true) ? true : false;
    }
}
