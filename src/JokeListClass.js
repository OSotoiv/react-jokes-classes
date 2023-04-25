import React from "react";
import axios from "axios";
import JokeClass from "./JokeClass"
import "./JokeList.css";

class JokeListClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = { jokes: [] }
    }
    componentDidMount() {
        this.getJokes()
    }

    async getJokes() {
        let j = [...this.state.jokes];
        let seenJokes = new Set();
        let num = this.numJokesToGet || 10;
        try {
            while (j.length < num) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });
                //destructure status and spred in the rest
                let { status, ...jokeObj } = res.data;
                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error("duplicate found!");
                }
            }
            this.setState({ jokes: j });
        } catch (e) {
            console.log(e);
        }
    }

    generateNewJokes() {
        this.setState({ jokes: [] });
    }

    vote(id, delta) {
        this.setState(st => ({
            jokes: st.jokes.map(j =>
                j.id === id ? { ...j, votes: j.votes + delta } : j
            )
        }));
    }

    render() {
        let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

        return (
            <div className="JokeList">
                <button className="JokeList-getmore" onClick={() => this.generateNewJokes()}>
                    Get New Jokes
                </button>

                {sortedJokes.map(j => (
                    <JokeClass text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={(id, delta) => this.vote(id, delta)} />
                ))}
            </div>
        )

    }
}
export default JokeListClass;