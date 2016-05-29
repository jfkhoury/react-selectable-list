import React from "react";
import classNames from "classnames";

export default class SelectionBar extends React.Component {

    render() {
        var selectPrevious = this.props.onSelectPrevious;
        var selectNext = this.props.onSelectNext;
        var prevClasses = classNames("selection-bar__prev-link", {"disabled": !this.props.isPreviousEnabled});
        var nextClasses = classNames("selection-bar__next-link", {"disabled": !this.props.isNextEnabled});

        return (
            <div className="selection-bar align-justify grid-block shrink">
                <a className={prevClasses} onClick={selectPrevious}>
                    Previous
                </a>
                <a className={nextClasses} onClick={selectNext}>
                    Next
                </a>
            </div>
        );
    }
}
