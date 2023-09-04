// https://developer.themoviedb.org/reference/movie-popular-list
//POPULAR FILMS

async function getMovies() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjUyZWE5NzhhNWRlZGE2MTE0NzkzMGU0NzEzYWVjMCIsInN1YiI6IjY0ZGE5OWRmZDEwMGI2MDBmZjBjNjNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OJzH9DCR_UtLcGqBg26fg_x6glShTLn2PKoTiUeD9ic",
    },
  };

  try {
    return fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    ).then((response) => response.json());
  } catch (error) {
    console.log(error);
  }
}

async function getMoreInfo(id) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjUyZWE5NzhhNWRlZGE2MTE0NzkzMGU0NzEzYWVjMCIsInN1YiI6IjY0ZGE5OWRmZDEwMGI2MDBmZjBjNjNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OJzH9DCR_UtLcGqBg26fg_x6glShTLn2PKoTiUeD9ic",
    },
  };

  try {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/" + id,
      options
    ).then((response) => response.json());

    return data;
  } catch (error) {
    console.log(error);
  }
}

//Trailer button => call traler video
//https://api.themoviedb.org/3/movie/{movie_id}/videos
//function Button
async function watch(e) {
  const movie_id = e.currentTarget.dataset.id;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjUyZWE5NzhhNWRlZGE2MTE0NzkzMGU0NzEzYWVjMCIsInN1YiI6IjY0ZGE5OWRmZDEwMGI2MDBmZjBjNjNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OJzH9DCR_UtLcGqBg26fg_x6glShTLn2PKoTiUeD9ic",
    },
  };

  try {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/videos`,
      options
    ).then((response) => response.json());

    const { results } = data;

    const youtubeVideo = results.find((video) => video.type === "Trailer");

    //open a new window
    window.open(`https://www.youtube.com/watch?v=${youtubeVideo.key}`, "blank");
  } catch (error) {
    console.log(error);
  }
}

function createMovieLayout({ id, title, start, image, time, year }) {
  return `
  <div class="movie">
  <div class="title">
    <span>${title}</span>

    <div>
      <img src="./assents/Star.svg" alt="film note">
      <p>${start}</p>
    </div>
  </div>

  <div class="poster">
    <img src="https://image.tmdb.org/t/p/w500${image}"
    alt="Image the ${title}">
  </div>

  <div class="info">
    <div class="duration">
        <img src="./assents/Clock.svg" alt="clock image">
        <span>${time}</span>
        </div>
   
        <div class="year">
          <img src="./assents/CalendarBlank.svg">
          <span>${year}</span>   
        </div>      

  </div>

  <button onclick="watch(event)" data-id="${id}">
    <img src="./assents/play.svg" alt="icons play">
    <span>Veja o Trailer</span>
  </button>
</div>
  
  `;
}

//function for 3 videos
function select3Videos(results) {
  const random = () => Math.floor(Math.random() * results.length);

  let selectedVideos = new Set();
  while (selectedVideos.size < 3) {
    selectedVideos.add(results[random()].id);
  }
  return [...selectedVideos];
}

//function of time (transformation)
function minutesToHourMinutesAndSeconds(minutes) {
  const date = new Date(null);
  date.setMinutes(minutes);
  return date.toISOString().slice(11, 19);
}

//function the start project
async function start() {
  const { results } = await getMovies();

  const best3 = select3Videos(results).map(async (movie) => {
    const info = await getMoreInfo(movie);

    const props = {
      id: info.id,
      title: info.title,
      start: Number(info.vote_average).toFixed(1),
      image: info.poster_path,
      time: minutesToHourMinutesAndSeconds(info.runtime),
      //years
      year: info.release_date.slice(0, 4),
    };

    return createMovieLayout(props);
  });

  const output = await Promise.all(best3);

  document.querySelector(".movies").innerHTML = output.join("");
}

start();
