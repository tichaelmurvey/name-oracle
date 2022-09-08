const queryURL = new URL("/names", window.location);
const queryURLmany = new URL("/names", window.location);
queryURL.searchParams.set("quant", 1);
queryURLmany.searchParams.set("quant", 30);

document
  .querySelectorAll(".question-body select")
  .forEach(function(elm) {
    queryURL.searchParams.set(elm.name, elm.value);
    queryURLmany.searchParams.set(elm.name, elm.value);
  });
console.log(queryURL);

document.querySelector("#go").setAttribute("href", queryURL);
document.querySelector("#more").setAttribute("href", queryURLmany);

const selectHandler = (event) => {
  const elm = event.currentTarget;
  queryURL.searchParams.set(elm.name, elm.value);
  queryURLmany.searchParams.set(elm.name, elm.value);
  document.querySelector("#go").setAttribute("href", queryURL);
  document.querySelector("#more").setAttribute("href", queryURLmany);
};
document
  .querySelectorAll(".question-body select")
  .forEach((selectElm) => selectElm.addEventListener("change", selectHandler));
