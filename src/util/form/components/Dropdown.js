// @flow

import React, { Component } from "react";
import { Link } from "react-router-dom";
import {isMobile} from "is-mobile";

import {
  dropdown,
  dropdownMenu,
  dropdownMenuRight,
  dropdownItem
} from "../../../css/form.css";
import { button, dropButton } from "../../../css/form.css";
import mobileOptionsStyles from "../../../css/components/mobile-options.css";

import DownChevronIcon from "../../../assets/svg/icons/chevronDown.svg";
import UpChevronIcon from "../../../assets/svg/icons/chevronUp.svg";

class Dropdown extends Component {
  static LINK_TYPE = "link";
  static CLICK_TYPE = "click";

  constructor(props) {
    super(props);
    this.state = {
      droppedDown: false
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleDropDown = this.handleDropDown.bind(this);
    this.dropdownType = this.dropdownType.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.closeDropdown();
    }
  };

  closeDropdown = () => {
    this.setState((prevState, props) => {
      return { droppedDown: false };
    });
  }

  setWrapperRef(node) {
    this.node = node;
  }

  handleDropDown(action = null, type = null) {
    this.setState((prevState, props) => {
      return { droppedDown: !prevState.droppedDown };
    });

    if (type === Dropdown.CLICK_TYPE && typeof action === "function") {
      action();
    }
  }

  dropdownType() {
    if (this.props.right) {
      return dropdownMenuRight;
    }
  }

  render() {
    if(isMobile()){
      return (
          <React.Fragment>
            <button
                onClick={this.handleDropDown}
                className={button + " " + dropButton}
            >
              <span>{this.props.title ? this.props.title : ""}</span>
              {this.state.droppedDown ? (
                  <UpChevronIcon height={10} />
              ) : (
                  <DownChevronIcon height={10} />
              )}
            </button>
            {
              this.state.droppedDown &&
              <div className={mobileOptionsStyles.container} onClick={this.closeDropdown}>
                <div className={mobileOptionsStyles.options}>
                  <div className={mobileOptionsStyles.optionGroup}>
                    {this.props.items.map((item, index) => (
                        <div
                            className={mobileOptionsStyles.option} key={index}
                            onClick={() => this.handleDropDown(item.action, item.type)}
                        >
                          {item.title}
                        </div>
                    ))}
                  </div>
                  <div className={mobileOptionsStyles.optionGroup}>
                    <div className={mobileOptionsStyles.option}>
                      <p>Cancel</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          </React.Fragment>
      );
    }

    return (
      <div className={dropdown} ref={this.setWrapperRef}>
        <button
          onClick={this.handleDropDown}
          className={button + " " + dropButton}
        >
          <span>{this.props.title ? this.props.title : ""}</span>
          {this.state.droppedDown ? (
            <UpChevronIcon height={10} />
          ) : (
            <DownChevronIcon height={10} />
          )}
        </button>
        {this.state.droppedDown && (
          <div className={dropdownMenu + " " + this.dropdownType()}>
            {this.props.items.map((item, index) => (
              <div className={dropdownItem} key={index}>
                {item.type === Dropdown.LINK_TYPE && (
                  <Link onClick={this.handleDropDown} to={item.action}>
                    {item.title}
                  </Link>
                )}
                {item.type === Dropdown.CLICK_TYPE && (
                  <li
                    onClick={() => this.handleDropDown(item.action, item.type)}
                  >
                    {item.title}
                  </li>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
