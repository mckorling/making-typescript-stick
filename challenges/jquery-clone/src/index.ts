import fetch from "node-fetch";

// order is important, namespace has to come second so it can piggyback off the function

// Adding class
class SelectorResult {
  #elements;
  constructor(elements: NodeListOf<Element>) {
    this.#elements = elements;
  }

  // Can be added by vs code
  html(contents: string) {
    // iterate over everyting fount
    this.#elements.forEach((elem) => {
      // and set contents equal to the string that was given
      elem.innerHTML = contents;
    });
  }

  // only some strings map to dom events, which can be found in HTMLElementEventMap
  on<K extends keyof HTMLElementEventMap>(
    eventName: K,
    cb: (event: HTMLElementEventMap[K]) => void
  ) {
    this.#elements.forEach((elem) => {
      // base class of addEventListener has ElementEventMap, but we need HTMLElementEventMap!
      // so will use a type guard, this is not the best practice
      const htmlElem = elem as HTMLElement;
      htmlElem.addEventListener(eventName, cb);
    });
  }
  show() {
    this.#elements.forEach((elem) => {
      // base class of addEventListener has ElementEventMap, but we need HTMLElementEventMap!
      // so will use a type guard, this is not the best practice
      const htmlElem = elem as HTMLElement;
      htmlElem.style.visibility = "visible";
    });
  }
  hide() {
    this.#elements.forEach((elem) => {
      // base class of addEventListener has ElementEventMap, but we need HTMLElementEventMap!
      // so will use a type guard, this is not the best practice
      const htmlElem = elem as HTMLElement;
      htmlElem.style.visibility = "hidden";
    });
  }
}

// Now this means that something can be selected like $("button.continue")
function $(selector: string) {
  // want to retain results of a query selector
  return new SelectorResult(document.querySelectorAll(selector));
}

namespace $ {
  // takes in an object
  // name success is very specific to match the object passed into ajax for part 3
  export function ajax({
    url,
    success,
  }: {
    url: string;
    success: (data: any) => void;
  }): any {
    return fetch(url)
      .then((response) => response.json())
      .then(success);
  }
}

export default $;

// Part 1
// once functionality was added function $, the html method showed and error
// that was defined in the class SelectorResult
$("button.continue").html("Next Step...");

// Part 2: need an on method, show method
const hiddenBox = $("#banner-message");
// when it's "click", "keydown", etc. hover over event to see the different event types that it knows now
$("#button-container button").on("click", (event) => {
  hiddenBox.show();
});

// Part 3
// pass in url and success callback, the result has a title and body
// working in the namespace sections
// (this still fails a test but matches the code in tutorial)
$.ajax({
  url: "https://jsonplaceholder.typicode.com/posts/33",
  success: (result) => {
    $("#post-info").html("<strong>" + result.title + "</strong>" + result.body);
  },
});
