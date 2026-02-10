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
      <button onclick="loadWord(${lesson.level_no})" class="btn btn-outline btn-primary">
        <i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}
      </button>
    `;

    levelContainer.append(btnDiv);
  });
};

const loadWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayWord(data.data));

  const displayWord = (words) => {
    const wordContainer = document.getElementById("wordContainer");
    wordContainer.innerHTML = "";

    words.forEach((word) => {
      const card = document.createElement("div");
      card.innerHTML = `
   <div class="text-center bg-white rounded-xl shadow-sm py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl">${word.word}</h2>
        <p class="font-semibold">Meaning /pronunciation</p>
        <h2>"${word.meaning} / ${word.pronunciation}"</h2>
        <div class="flex justify-between items-center">
        <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
        <i class="fa-solid fa-circle-info"></i>
        </button>
          <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
          <i class="fa-solid fa-volume-high"></i>
          </button>
         
        </div>
      </div>
     `;
      wordContainer.append(card);
    });
  };
};

loadLessons();
