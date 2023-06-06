export interface DataEntity {
  id: string;
}
export interface Movie extends DataEntity {
  director: string;
}
export interface Song extends DataEntity {
  singer: string;
}
/// Everything above was not changed

// export interface Comic extends DataEntity {
//   issueNumber: number;
// }

// play with this by adding comic to test tests/code
export type DataEntityMap = {
  movie: Movie;
  song: Song;
  // comic: Comic;
};

// template literal types, we want what is derived from movie and song above
// can only have one index signature in a type/interface, so need to use '&'
type DataStoreMethods = {
  [K in keyof DataEntityMap as `getAll${Capitalize<K>}s`]: () => DataEntityMap[K][]; // return type is via indexed access types
} & {
  [K in keyof DataEntityMap as `get${Capitalize<K>}`]: (
    id: string
  ) => DataEntityMap[K];
} & {
  [K in keyof DataEntityMap as `add${Capitalize<K>}`]: (
    arg: DataEntityMap[K]
  ) => DataEntityMap[K];
} & {
  [K in keyof DataEntityMap as `clear${Capitalize<K>}s`]: () => void;
};

// generic type checker, type guard. This returns a boolean with a specific meaning
// it tells the type system specific information
// if it returns true, then x is of type T
function isDefined<T>(x: T | undefined): x is T {
  return typeof x !== "undefined";
}

// Only need to change this
export class DataStore implements DataStoreMethods {
  // make data a true private variable
  // Record is a short cut to a dictionary
  // Give me an object with key of string and value type of DataEntityMap[K]

  #data: { [K in keyof DataEntityMap]: Record<string, DataEntityMap[K]> } = {
    movie: {},
    song: {},
  };

  getAllSongs(): Song[] {
    // get all keys
    // iterate over keys and get respective song
    // filter out anything that might be undefined
    return Object.keys(this.#data.song)
      .map((songKey) => this.#data.song[songKey])
      .filter(isDefined);
  }
  getSong(id: string): Song {
    const song = this.#data.song[id];
    if (!song) throw new Error(`Could not retrieve song with id: ${id}`);
    return song;
  }
  clearSongs(): void {
    this.#data.song = {};
  }
  addSong(arg: Song): Song {
    this.#data.song[arg.id] = arg;
    return arg;
  }

  getAllMovies(): Movie[] {
    return Object.keys(this.#data.movie)
      .map((movieKey) => this.#data.movie[movieKey])
      .filter(isDefined);
  }
  getMovie(id: string): Movie {
    const movie = this.#data.movie[id];
    if (!movie) throw new Error(`Could not retrieve movie with id: ${id}`);
    return movie;
  }
  clearMovies(): void {
    this.#data.movie = {};
  }
  addMovie(arg: Movie): Movie {
    this.#data.movie[arg.id] = arg;
    return arg;
  }
}

// SUMMARY
// have a convention that can be established across multiple data types
// it is a type alias that is implemented with a class
// had to manually hadd the functions into the class
// so if you uncommented comics related code, errors will pop up that will
// show there are missing methods for comics
