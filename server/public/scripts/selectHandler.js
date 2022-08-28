const queryURL = new URL("/names", window.location);

document
  .querySelectorAll(".question-body select")
  .forEach((elm) => queryURL.searchParams.set(elm.name, elm.value));

console.log(queryURL);

document.querySelector("#go").setAttribute("href", queryURL);

const selectHandler = (event) => {
  const elm = event.currentTarget;
  queryURL.searchParams.set(elm.name, elm.value);
  console.log(queryURL);
  return queryURL;
};
document
  .querySelectorAll(".question-body select")
  .forEach((selectElm) => selectElm.addEventListener("change", selectHandler));
