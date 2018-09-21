/**
 * @desc Module responsibile for rendering the user interface
 * @export
 * @class UI
 */
export default class UI {
  /**
   * @instance
   * @desc Loops through the props and creates a div for each property.
   * checking for an array on the first attribute will be the number of divs required
   * calls renderCard() which loops through all attributes on the
   * property object creating DOM elements for each attribute to attach to the div.
   * if no properties are found it will render a card with message.
   * @memberOf UI
   * @param {object} obj Contains a singular countries data
   * @listens country:mouseover
   * @fires UI:renderCard
   */
  renderInfo(obj) {
    let info = UI._("#info")[0];
    var props = obj.properties;
    if (props["media"].length) {
      Object.keys(props).forEach((key, pos) => {
        if (props[key].length && pos == 0) {
          props[key].forEach((el, pos) => {
            let card = this.renderCard(props, pos);
            info.appendChild(card);
          });
        }
      });
    } else {
      var msg = { message: "No Data at this time" };
      let card = this.renderCard(msg);
      info.appendChild(card);
    }
  }

  /**
   * @instance
   * @desc Removes the rendered elements from the UI
   * @memberOf UI
   * @listens country:mouseout
   *
   */
  clearInfo() {
    let info = UI._("#info")[0];
    while (info.firstChild) {
      info.removeChild(info.firstChild);
    }
  }
  /**
   *
   * @instance
   * @param {object} obj Contains a singular countries data
   * @param {number} pos Current index of property interation
   * @returns DOM element to attach to info sidebar
   *
   * @memberOf UI
   */
  renderCard(obj, pos) {
    // setup
    let attributes = Object.keys(obj);
    let card = document.createElement("figure");
    let caption = document.createElement("figcaption");
    card.appendChild(caption);
    card.className += "card";
    // loop through attributes
    attributes.forEach(key => {
      if (Array.isArray(obj[key])) {
        let item = obj[key][pos];
        var el;
        if (item.charAt(0) == "/") {
          el = document.createElement("img");
          el.setAttribute("src", `https:${item}`);
        } else {
          el = document.createElement("p");
          let text = document.createTextNode(`${item}`);
          el.appendChild(text);
        }
        card.appendChild(el);
      } else {
        let h2 = document.createElement("h2");
        let text = document.createTextNode(obj[key]);
        h2.setAttribute("class", "country-banner");
        h2.appendChild(text);
        card.appendChild(h2);
      }
    });
    return card;
  }
  /**
   * @desc Takes a string selector and returns a nodelist of that selection
   * The returned NodeList will contain all the elements in the document that
   * are matched by any of the specified selectors. If the selectors string
   * contains a CSS pseudo-element, the returned elementList will be empty.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
   * @memberOf UI
   * @param {string} selector
   * @returns {NodeList}
   */
  static _(selector) {
    return document.querySelectorAll(selector);
  }
}
