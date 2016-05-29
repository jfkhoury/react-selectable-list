import React from "react";
import classNames from "classnames";

export default class ListItem extends React.Component {
    render() {
        var classes = { "ysl__item--is-visited": this.props.hasBeenVisited && !this.props.isSelected,
                        "ysl__item--is-selected": !this.props.isDisabled && this.props.isSelected,
                        "ysl__item--is-active": !this.props.isDisabled && this.props.isActive,
                        "ysl__item--is-disabled": this.props.isDisabled };

        return (
            <li className={classNames("ysl__item grid-block shrink", classes)} onClick={this.props.onSelect}>
               {this.props.children}
            </li>
        );
    }
}
