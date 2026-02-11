const createElements = (arr) => {
  const htmlElement = arr.map((syn) => `<span class="btn">${syn}</span>`);
  return htmlElement.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
const loading = (status) => {
  if (status == true) {
    document.getElementById("loadingWait").classList.remove("hidden");
    document.getElementById("wordContainer").classList.add("hidden");
  } else {
    document.getElementById("wordContainer").classList.remove("hidden");
    document.getElementById("loadingWait").classList.add("hidden");
  }
};

const loadLessons = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";

  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLesson(data.data));
};

const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("lessonDiv");
  levelContainer.innerHTML = "";

  lessons.forEach((lesson) => {
    const btnDiv = document.createElement("div");

    btnDiv.innerHTML = `
      <button id="lesson-btn-${lesson.level_no}" onclick="loadWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}
      </button>
    `;

    levelContainer.append(btnDiv);
  });
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};
const loadWordDetails = (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => modalDetailsView(data.data));
};
// {
//     "word": "Eager",
//     "meaning": "আগ্রহী",
//     "pronunciation": "ইগার",
//     "level": 1,
//     "sentence": "The kids were eager to open their gifts.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "enthusiastic",
//         "excited",
//         "keen"
//     ],
//     "id": 5
// }
const modalDetailsView = (data) => {
  const modalSpace = document.getElementById("modalWord");
  modalSpace.innerHTML = `
  <h2 class="font-bold text-2xl">${data.word} (<i class="fa-solid fa-microphone-lines"></i>:<span class="font-bangla">${data.pronunciation}</span>)</h2>
    <div>
                 <h2 class="font-semibold">Meaning</h2>
                <p class="text-xl font-bangla">${data.meaning ? data.meaning : "অর্থ পাওয়া যায় নি"}</p>
    </div>
  <div>
               <h2 class="font-bold">Example</h2>
              <p>${data.sentence}</p>
  </div>
 <div>
                <h2 class="font-bold font-bangla">সমার্থক শব্দ গুলো</h2>
             <div>${createElements(data.synonyms)}</div>
 </div>
          `;
};
const loadWord = (id) => {
  loading(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");

      displayWord(data.data);
    });
};
const displayWord = (words) => {
  const wordContainer = document.getElementById("wordContainer");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    loading(false);
    wordContainer.innerHTML = `  
      <div class="col-span-full text-center space-y-6 my-4 font-bangla">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-4xl font-medium">নেক্সট Lesson এ যান</h2>
      </div>`;
    return;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
   <div class="text-center bg-white rounded-xl shadow-sm py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h2>
        <p class="font-semibold">Meaning /pronunciation</p>
        <h2 class=" font-bold font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায় নি"}"</h2>
        <div class="flex justify-between items-center">
        <button onclick="my_modal_5.showModal();loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
        <i class="fa-solid fa-circle-info"></i>
        </button>
          <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
          <i class="fa-solid fa-volume-high"></i>
          </button>
         
        </div>
      </div>
     `;
    wordContainer.append(card);
  });
  loading(false);
};

loadLessons();

document.getElementById("btnSearch").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("inputSearch");
  const searchValue = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;

      const result = allWords.filter((item) =>
        item.word.toLowerCase().includes(searchValue),
      );
      displayWord(result);
    });
});
