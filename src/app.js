import isValidUrl from "./validate";
import onChange from "on-change";

const rssForm = document.querySelector(".rss-form");
const urlInput = rssForm.querySelector("#url-input");
const submitBtn = rssForm.querySelector(".btn");
const feedback = document.querySelector(".feedback");

export default () => {
  const state = {
    rssForm: {
      value: "",
      posted: [],
      state: "filling",
      validation: null,
      error: "",
    },
  };

  const watchedState = onChange(state, (path, value) => {
    const inputValue = state.rssForm.value;
    if (path === "rssForm.validation") {
      if (value) {
        if (urlInput.classList.contains("is-invalid")) {
          urlInput.classList.remove("is-invalid");
        }
        watchedState.rssForm.state = "posting";
      } else {
        urlInput.classList.add("is-invalid");
      }
    } else if (path === "rssForm.state") {
      if (value === "posting") {
        submitBtn.disabled = true;
        feedback.textContent = "RSS успешно загружен";
        state.rssForm.posted.push(inputValue);
        watchedState.rssForm.state = "filling";
      } else {
        rssForm.reset();
        submitBtn.disabled = false;
        state.rssForm.validation = null;
      }
    } else if (path === "rssForm.error") {
      feedback.textContent = value;
    }
  });

  rssForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { value, posted } = state.rssForm;
    isValidUrl(value, posted)
      .then(() => (watchedState.rssForm.validation = true))
      .catch((e) => {
        watchedState.rssForm.validation = false;
        if (e.message.includes("following values")) {
          watchedState.rssForm.error = "RSS уже существует";
        } else if (e.message.includes("valid")) {
          watchedState.rssForm.error = "Ссылка должна быть валидным URL";
        }
      });
  });

  urlInput.addEventListener("input", (e) => {
    state.rssForm.value = e.target.value;
  });
};
