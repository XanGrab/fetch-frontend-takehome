class Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface SearchParams {
  breeds?: Array<string>;
  zipCodes?: Array<string>;
  ageMin?: int;
  ageMax?: int;
  size: int;
  from?: int;
  sort?: "field:[asc]" | "field[desc]";
}

interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}
interface Match {
  match: string;
}

export { Dog, SearchParams, Location, Coordinates, Match };
