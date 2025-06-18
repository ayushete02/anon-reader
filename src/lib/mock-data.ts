import { Comic, User } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    email: "demo@example.com",
    name: "Demo User",
    persona: {
      storyEndingPreference: "Love wins",
      justiceOrMercy: "Mercy",
      planOrMess: "Glorious Mess",
      riskOrFaith: "Leap of Faith",
      twistOrPayoff: "Satisfying Payoff",
      hopeOrHonesty: "Unshakeable Hope",
      greaterGoodOrPersonalBond: "Personal Bond",
      vibes: ["Cozy & Heartwarming", "Witty & Charming"],
      favoriteTwist: "Identity reveal",
      personaType: "The Dreamer",
    },
    favorites: ["1", "3"],
    history: [
      {
        comicId: "1",
        lastReadPage: 3,
        lastReadAt: "2025-06-17T14:30:00Z",
        progress: 30,
      },
      {
        comicId: "2",
        lastReadPage: 1,
        lastReadAt: "2025-06-16T09:15:00Z",
        progress: 10,
      },
    ],
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "u2",
    email: "user@test.com",
    name: "Test User",
    persona: {
      storyEndingPreference: "Justice served",
      justiceOrMercy: "Justice",
      planOrMess: "Perfect Plan",
      riskOrFaith: "Calculated Risk",
      twistOrPayoff: "Shocking Twist",
      hopeOrHonesty: "Brutal Honesty",
      greaterGoodOrPersonalBond: "Greater Good",
      vibes: ["Dark & Brooding", "Action-Packed & Thrilling"],
      favoriteTwist: "Hidden betrayal",
      personaType: "The Strategist",
    },
    favorites: ["2", "4"],
    history: [
      {
        comicId: "4",
        lastReadPage: 5,
        lastReadAt: "2025-06-18T10:45:00Z",
        progress: 50,
      },
    ],
    createdAt: "2025-02-15T00:00:00Z",
  },
];

export const MOCK_COMICS: Comic[] = [
  {
    id: "1",
    title: "The Last Guardian",
    description:
      "An epic tale of a young warrior tasked with protecting the last magical creature in the realm. Follow Aria as she discovers her destiny and learns the true meaning of courage.",
    posterImage:
      "https://m.media-amazon.com/images/I/51IFcninsvL._SX342_SY445_PQ23_.jpg",
    categories: ["Fantasy", "Adventure", "Epic & Grandiose"],
    type: "image",
    releaseDate: "2024-01-15",
    popularity: 95,
    rating: 4.8,
    pages: [
      {
        id: 0,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 1,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 2,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 3,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 4,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 5,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 6,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 7,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 8,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 9,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
    ],
  },
  {
    id: "2",
    title: "Midnight Chronicles",
    description:
      "A dark detective story set in a dystopian future where night never ends. Detective Morgan Kane investigates a series of mysterious disappearances in Neo-Tokyo.",
    posterImage:
      "https://www.yourdecoration.com/cdn/shop/files/abystyle-abydco754-dc-comics-superman-poster-61x91-5cm_2e22d54f-c92d-4acb-a8f3-efc49d9ec202_500x.jpg?v=1721810611",
    categories: ["Noir", "Mystery", "Dark & Brooding"],
    type: "text",
    releaseDate: "2024-02-23",
    popularity: 87,
    rating: 4.5,
    textContent: [
      {
        id: 1,
        title: "Chapter 1: The Endless Night",
        paragraphs: [
          "The neon lights of Neo-Tokyo never dimmed, casting an eternal twilight over the sprawling metropolis. Detective Morgan Kane stood at the edge of the rooftop, watching the rain cascade down in sheets that blurred the city into an impressionist painting of light and shadow.",
          "Three people had vanished in the past week. No trace, no witnesses, no explanation. In a city where surveillance cameras watched every corner and AI tracked every movement, disappearing completely was supposed to be impossible.",
          "Kane pulled his coat tighter against the wind and descended into the building. The elevator hummed as it carried him down to street level, where the real investigation would begin.",
          "The first victim was Sarah Chen, a data analyst who worked the night shift at Nexus Corp. According to her coworkers, she left the building at 3 AM and never made it home. The security footage showed her walking to the transit station, but she never boarded any train.",
          "Kane studied the grainy footage on his tablet. There, between frames 1247 and 1248, Sarah simply wasn't there anymore. The timestamp showed no gap, no glitch. She had vanished between one moment and the next.",
        ],
      },
      {
        id: 2,
        title: "Chapter 2: Digital Shadows",
        paragraphs: [
          "The Nexus Corp building towered above the district like a monolithic sentinel. Kane badged in through the main entrance, his credentials granting him access to the investigation.",
          "Sarah's workstation was exactly as she'd left it. Coffee cup half-empty, family photo positioned to catch the light from her monitor. Kane booted up her computer and began sifting through her recent activities.",
          "The data logs showed nothing unusual. Routine analysis reports, email correspondence with team members, a few personal messages. But as Kane dug deeper, he noticed something odd.",
          "In the system logs, there were access attempts to classified files just minutes before Sarah's shift ended. Files she shouldn't have had clearance for. Files related to something called 'Project Mirror.'",
          "Kane made a note and continued his search. If Sarah had stumbled onto something she shouldn't have seen, it might explain her disappearance. But it didn't explain how she had vanished so completely.",
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Hearth & Home",
    description:
      "A slice-of-life story about finding peace and connection in a small magical village. Join Luna as she discovers the simple joys of community and belonging.",
    posterImage: "https://i.ebayimg.com/images/g/z~wAAOSwHH5hCbDE/s-l1600.webp",
    categories: ["Slice of Life", "Fantasy", "Cozy & Heartwarming"],
    type: "text",
    releaseDate: "2024-03-10",
    popularity: 82,
    rating: 4.7,
    textContent: [
      {
        id: 1,
        title: "A New Beginning",
        paragraphs: [
          "Luna's cart creaked along the cobblestone path as Willowbrook came into view. The village was everything the travel pamphlet had promised—thatched roofs dotted with wildflowers, smoke curling from chimneys, and gardens that seemed to bloom with their own inner light.",
          "She had left the city with nothing but a few belongings and a heart heavy with the weight of past disappointments. The job offer at the village apothecary had come at exactly the right moment, like a gentle hand reaching out when she needed it most.",
          "The villagers she passed smiled and waved, some calling out cheerful greetings to the newcomer. Luna felt a warmth spread through her chest—something she hadn't experienced in years.",
          "The apothecary stood at the village center, its windows displaying bottles of shimmering potions and dried herbs that moved gently in the breeze without any wind to stir them. Above the door, a wooden sign read 'Moonflower Remedies' in elegant script.",
          "Luna took a deep breath and pushed open the door. A bell chimed softly, and she stepped into what would become her new life.",
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Quantum Break",
    description:
      "When a physics experiment goes wrong, reality itself begins to fracture. Dr. Elena Vasquez must navigate through shifting timelines to prevent the collapse of existence.",
    posterImage:
      "https://knowherecomics.com/cdn/shop/products/0922DC144.jpg?v=1669153553&width=420",
    categories: ["Sci-Fi", "Thriller", "Mind-Bending & Mysterious"],
    type: "image",
    releaseDate: "2024-04-05",
    popularity: 91,
    rating: 4.6,
    pages: [
      {
        id: 0,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 1,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 2,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 3,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
    ],
  },
  {
    id: "5",
    title: "The Jester's Court",
    description:
      "A witty tale of political intrigue told from the perspective of Pip, a royal jester who sees more than he lets on. In a court full of secrets, sometimes the fool is the wisest of all.",
    posterImage: "https://media.mycomicshop.com/n_iv/600/642625.jpg",
    categories: ["Comedy", "Historical", "Witty & Charming"],
    type: "text",
    releaseDate: "2024-05-12",
    popularity: 79,
    rating: 4.3,
    textContent: [
      {
        id: 1,
        title: "The Fool's Wisdom",
        paragraphs: [
          "Pip jingled into the throne room, his colorful motley a stark contrast to the somber faces of the assembled courtiers. King Edmund sat rigid on his throne, while Queen Isabelle maintained her practiced smile—the one that never quite reached her eyes.",
          "The royal summons had been unexpected. Jesters were entertainment for feast days and festivals, not witnesses to matters of state. Yet here Pip was, bells silent for once as he assessed the tension crackling through the air like lightning before a storm.",
          "'My lord,' announced the herald, 'the ambassador from Valdris requests an audience.'",
          "Pip watched the subtle exchange of glances between the queen and her brother, Lord Marcus. Something was amiss. In his years of juggling and jesting, Pip had learned that the most important conversations happened in the spaces between words.",
          "The ambassador entered with measured steps, his diplomatic smile as sharp as a blade. 'Your Majesty,' he began, 'I bring greetings from King Aldric, and a proposal that could benefit both our kingdoms greatly.'",
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Final Stand",
    description:
      "The heart-wrenching story of the last survivors of a galactic war. Commander Zara Chen leads the final evacuation as enemy forces close in on the last human stronghold.",
    posterImage: "https://media.mycomicshop.com/n_iv/600/5343551.jpg",
    categories: ["Sci-Fi", "Drama", "Tragic & Cathartic"],
    type: "image",
    releaseDate: "2024-06-20",
    popularity: 88,
    rating: 4.9,
    pages: [
      {
        id: 0,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 1,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 2,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 3,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 4,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
    ],
  },
  {
    id: "7",
    title: "Spider-Man: Web of Destiny",
    description:
      "Join Spider-Man as he swings through New York City facing his greatest challenges yet. A classic comic experience with stunning retro artwork and thrilling action sequences.",
    posterImage:
      "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
    categories: ["Superhero", "Action", "Classic"],
    type: "image",
    releaseDate: "2024-06-19",
    popularity: 96,
    rating: 4.9,
    pages: [
      {
        id: 0,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 1,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 2,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 3,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 4,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 5,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 6,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 7,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 8,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 9,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
      {
        id: 10,
        imageUrl:
          "https://images-cdn.ubuy.co.in/6350381938574c70e8539544-spider-man-retro-comic-poster-size.jpg",
      },
    ],
  },
];
