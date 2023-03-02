console.clear();

const body = document.querySelector('body');
const categories_list = document.getElementById('categories-list');
const newsContainer = document.getElementById('news-container');
const itemsFound = document.getElementById('itemsFound');
const progressBar = document.getElementById('progressBar');
const modalContainer = document.getElementById('modalContainer');
const todaysPick = document.getElementById('todays-pick');
const trending = document.getElementById('trending');


body.addEventListener('load',loadCategories());

async function loadCategories() {
  // Loading starts
    newsContainer.innerHTML = `<div class='flex justify-center items-center h-[50vh]'>
    <progress
    class="progress w-40 mx-auto bg-white"
    id="progressBar"
  ></progress>
    </div>`;
    // loading categories from server
    try {
    const res = await fetch('https://openapi.programming-hero.com/api/news/categories');
    const data = await res.json();
    displayCategories(data.data.news_category);
    loadNews('01');
    }
    catch (err) {
      newsContainer.innerHTML = '';
        // alert(err.message);
        newsContainer.innerHTML = `<div>
            <h1 class="flex justify-center items-center h-[50vh] text-3xl font-semibold">Failed to load data</h1>
        </div>`;
    }
}

function displayCategories(categories) {
    categories.forEach(item => {
        categories_list.innerHTML += `
            <li 
            class="hover:bg-indigo-100 active px-2 py-1 duration-300 rounded-md hover:text-purple-600 cursor-pointer active:bg-indigo-100"
            onclick="loadNews('${item.category_id}', '${item.category_name}')"
            >
            ${item.category_name}
            </li>
        `
    })
}

// Loading news from the server
function loadNews(id,category_name) {
    newsContainer.innerHTML = `<div class='flex justify-center items-center h-[50vh]'>
    <progress
    class="progress w-40 mx-auto bg-white"
    id="progressBar"
  ></progress>
    </div>`;
    fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
    .then(res => res.json())
    .then(data => {
       if(data.data.length !== 0) {
        displayNews(data.data,category_name);
       } else {
        itemsFound.innerHTML = `${data.data.length} items found for category <span class='text-blue-600 text-xl'>${category_name ? category_name : 'Home'}</span>`;
        newsContainer.innerHTML = `<div>
            <h1 class="flex justify-center items-center h-[50vh] text-3xl font-semibold">No news found for category Culture</h1>
        </div>`;
       }
    });
}

// Displaying the news on the DOM
function displayNews(items,category_name) {
    itemsFound.innerHTML = `${items.length} items found for category <span class='text-blue-600 text-xl'>${category_name ? category_name : 'Home'}</span>`;
    newsContainer.innerHTML = '';
    items.forEach(item => {
     newsContainer.innerHTML += `
        <article class="flex flex-col md:flex-row p-4 bg-white gap-6 rounded-lg">
          <div class="h-full md:h-60 md:w-1/6">
            <img
              class="h-full w-full rounded-lg"
              src="${item.thumbnail_url}"
            />
          </div>
          <div class="md:w-5/6 flex flex-col justify-between">
            <h1 class="text-xl font-semibold">${item.title}</h1>
            <p class="mb-2 text-slate-500 text-justify">${item.details}</p>
            <p class="text-slate-500 text-justify">${item.details.slice(0, 120)}</p>
            <div
              class="flex flex-wrap gap-3 md:gap-0 justify-between items-center mt-3 md:mt-0"
            >
              <div class="flex md:flex-col lg:flex-row items-center gap-1">
                <img class="h-10 w-10 rounded-full" src="${item.author.img}" />
                <div class="text-center">
                  <p class="text-gray-700">${item.author.name}</p>
                  <p class="-mt-1 text-gray-500 text-sm">${item.author.published_date? item.author.published_date.slice(0,10): '2021-04-09'}</p>
                </div>
              </div>
              <div>
                <i class="fa-regular fa-eye"></i>
                <span class="font-semibold">${item.total_view ? item.total_view : 420}</span>
              </div>
              <div>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>
              </div>
              <div class="text-blue-600">
              <!-- The button to open modal -->
                <label for="newsDetails" onclick="loadDetails('${item._id}')">
                  <i class="fa-solid fa-right-long fa-2x cursor-pointer"></i>
                </label>
              </div>
            </div>
          </div>
        </article>
        `
    })
}

function loadDetails(news_id) {
  console.log(news_id);
  fetch(`https://openapi.programming-hero.com/api/news/${news_id}`)
  .then(res => res.json())
  .then(data => {
    modalContainer.innerHTML = '';
    displayDetails(data.data[0]);
  });
}

function displayDetails(item) {
  console.log(item);
  modalContainer.innerHTML = `
  <article class="flex flex-col md:flex-row p-10 bg-white gap-6 rounded-lg  h-[90vh]">
  <div class="">
    <img
      class="h-full w-full rounded-lg"
      src="${item.thumbnail_url}"
    />
  </div>
  <div class="md:w-5/6 flex flex-col justify-between overflow-auto h-[77vh] pl-2 pr-4">
    <h1 class="text-xl font-semibold">${item.title}</h1>
    <p class="mb-2 text-slate-500 text-justify">${item.details}</p>
    <p class="text-slate-500 text-justify">${item.details.slice(0, 120)}</p>
    <div
      class="flex flex-wrap gap-3 md:gap-0 justify-between items-center mt-3 md:mt-0"
    >
      <div class="flex md:flex-col lg:flex-row items-center gap-1">
        <img class="h-10 w-10 rounded-full" src="${item.author.img}" />
        <div class="text-center">
          <p class="text-gray-700">${item.author.name}</p>
          <p class="-mt-1 text-gray-500 text-sm">${item.author.published_date? item.author.published_date.slice(0,10): '2021-04-09'}</p>
        </div>
      </div>
      <div>
        <i class="fa-regular fa-eye"></i>
        <span class="font-semibold">${item.total_view ? item.total_view : 420}</span>
      </div>
      <div>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star-half-stroke"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
      </div>
      <div class="text-blue-600">
      <!-- The button to open modal -->
        <label for="newsDetails" onclick="loadDetails('${item._id}')">
          <i class="fa-solid fa-x fa-2x cursor-pointer"></i>
        </label>
      </div>
    </div>
  </div>
</article>
  `
}


todaysPick.addEventListener('click', function () {
  fetch('https://openapi.programming-hero.com/api/news/category/08')
  .then(res => res.json())
  .then(data => {
    const forTodays = data.data.filter(data => data.others_info.is_todays_pick);
    displayNews(forTodays, 'Today\'s pick');
  })
});
trending.addEventListener('click', function () {
  fetch('https://openapi.programming-hero.com/api/news/category/08')
  .then(res => res.json())
  .then(data => {
    const forTrending = data.data.filter(data => data.others_info.is_trending);
    displayNews(forTrending , 'Trending');
  })
});

