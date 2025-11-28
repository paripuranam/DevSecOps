import { Movie } from "./types";

// Enhanced fallback data with real TMDB paths for a better "clone" feel out of the box
export const FALLBACK_MOVIES: Movie[] = [
  {
    id: "f1",
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    genre: ["Sci-Fi", "Adventure"],
    year: 2024,
    rating: 8.9,
    director: "Denis Villeneuve",
    matchScore: 98,
    posterPath: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropPath: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg"
  },
  {
    id: "f2",
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: ["Sci-Fi", "Action"],
    year: 2010,
    rating: 8.8,
    director: "Christopher Nolan",
    matchScore: 99,
    posterPath: "/9gk7admal4ZLcnwnCSNMtVVbMEP.jpg",
    backdropPath: "/s3TBrRGB1jav7nXgG5ulxEXUS3u.jpg"
  },
  {
    id: "f3",
    title: "Spider-Man: Across the Spider-Verse",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    genre: ["Animation", "Action"],
    year: 2023,
    rating: 8.6,
    director: "Joaquim Dos Santos",
    matchScore: 97,
    posterPath: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdropPath: "/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg"
  },
  {
    id: "f4",
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime"],
    year: 2008,
    rating: 9.0,
    director: "Christopher Nolan",
    matchScore: 96,
    posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropPath: "/dqK9UFagCOPa3CMjo515XR_oTEV.jpg"
  },
  {
    id: "f5",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: ["Sci-Fi", "Drama"],
    year: 2014,
    rating: 8.7,
    director: "Christopher Nolan",
    matchScore: 95,
    posterPath: "/gEU2QniL6E8ahMcafCUYA875DD9.jpg",
    backdropPath: "/xJHokMBLkbke0umzhT5bCs9n1hw.jpg"
  }
];

export const GENRES = [
  "Trending Now",
  "Sci-Fi & Cyberpunk",
  "High-Octane Action",
  "Mind-Bending Thrillers",
  "Dark Comedies",
  "Award-Winning Dramas"
];