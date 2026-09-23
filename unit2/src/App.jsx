import Gaming from "./assets/Gaming.jpg";
import Music from "./assets/music.jpg";
import Reading from "./assets/Reading.jpg";
import Photography from "./assets/Photography.jpg";
import Traveling from "./assets/Travelling.jpg";
import Cooking from "./assets/cooking.jpg";
import "./App.css";

// ─── Child Component ──────────────────────────────────────────────────────────
function HobbyCard(props) {
  return (
    <div className="card">
      <img src={props.image} alt={props.hobby} />
      <h2>{props.hobby}</h2>
      <p>{props.description}</p>
    </div>
  );
} 


// ─── Parent Component ─────────────────────────────────────────────────────────
function Hobby() {
  return (
    <div className="page">
      <h1>My Hobbies</h1>

      <div className="hobby-container">
        <HobbyCard
          image={Gaming}
          hobby="Gaming"
          description="I enjoy playing video games."
        />

        <HobbyCard
          image={Music}
          hobby="Music"
          description="I love listening to music."
        />

        <HobbyCard
          image={Reading}
          hobby="Reading"
          description="I enjoy reading books."
        />

        <HobbyCard
          image={Photography}
          hobby="Photography"
          description="I like taking beautiful photos."
        />

        <HobbyCard
          image={Traveling}
          hobby="Traveling"
          description="I enjoy visiting new places."
        />

        <HobbyCard
          image={Cooking}
          hobby="Cooking"
          description="I enjoy cooking different dishes."
        />
      </div>
    </div>
  );
}

export default Hobby;
