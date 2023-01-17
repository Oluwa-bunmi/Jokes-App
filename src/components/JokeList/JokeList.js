import React, { Component } from "react";
import axios from "axios";
import "./JokeList.css";
import Joke from "../Joke/Joke";
import { v1 } from "uuid";

class JokeList extends Component {
  static defaultProps = {
    jokesNumber: 10,
  };
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }
  async getJokes() {
    let jokes = [];
    while (jokes.length < this.props.jokesNumber) {
      let response = await axios.get("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });
      jokes.push({ id: v1(), text: response.data.joke, votes: 0 });
    }
    this.setState(
      (st) => ({
        jokes: [...st.jokes, ...jokes],
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
    window.localStorage.setItem("jokes", JSON.stringify(jokes));
  }
  handleVotes(id, change) {
    this.setState(
      (st) => ({
        jokes: st.jokes.map((j) =>
          j.id === id ? { ...j, votes: j.votes + change } : j
        ),
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  handleClick() {
    this.getJokes();
  }
  render() {
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1>
            <span> Dad</span> Joke
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="emoji"
          />
          <button className="JokeList-getmore" onClick={this.handleClick}>
            Fetch Jokes
          </button>
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map((j) => (
            <Joke
              key={j.id}
              votes={j.votes}
              text={j.text}
              upvote={() => this.handleVotes(j.id, 1)}
              downvote={() => this.handleVotes(j.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
