type User = {
  name: string;
  email: string;
};
type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};
type Match = {
  match: string;
};
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

export { Dog, Match, Location, Coordinates };
