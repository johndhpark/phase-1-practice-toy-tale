let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const form = document.querySelector(".add-toy-form");
  const toyFormContainer = document.querySelector(".container");
  const container = document.querySelector("#toy-collection");

  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => displayToy(item));
    });

  function displayToy(item) {
    let { id, name, image, likes } = item;

    const div = document.createElement("div");
    div.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = name;

    const img = document.createElement("img");
    img.classList.add("toy-avatar");
    img.setAttribute("src", image);

    const p = document.createElement("p");
    p.textContent = `${likes} Likes`;

    const btn = document.createElement("button");
    btn.classList.add("like-btn");
    btn.setAttribute("id", id);
    btn.textContent = "Like ❤️";
    btn.addEventListener("click", () => {
      likes += 1;

      fetch(`http://localhost:3000/toys/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes,
        }),
      })
        .then((res) => res.json())
        .then(
          ({ likes: likesCount }) => (p.textContent = `${likesCount} Likes`)
        );
    });

    div.append(h2, img, p, btn);

    container.appendChild(div);
  }

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0,
      }),
    })
      .then((res) => res.json())
      .then((data) => displayToy(data));
  });
});
