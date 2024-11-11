import { useEffect, useState, useRef } from "react";
import Store from "./GreetingStore";

export default function SymbolicInteractions() {
  const [greetings, setGreetings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const store = useRef(new Store());
  const MESSAGES_PER_PAGE = 15;

  useEffect(async () => {
    const greetings = await store.current.getGreetings();
    setGreetings(greetings);
  }, []);

  /**
   * Creates a new greeting object and adds it to the greetings array.
   * The Firestore database is also updated.
   * @param {string} nickname - The name of the person who is greeting.
   * @param {string} greeting - The type of greeting.
   */
  function addGreeting(nickname, text) {
    const greetingObj = { nickname, text };
    setGreetings([...greetings, greetingObj]);
    setCurrentPage(Math.floor(greetings.length / MESSAGES_PER_PAGE));
  }

  function addGreeting() {
    const nickname = this.view.nicknameInput.value;
    let text;
    if (greetingSelect.value === '직접 쓰기 ...') {
      text = `${this.view.greetingTextInput.value} ${this.view.greetingEmojiInput.value}`;
    } else {
      text = this.view.greetingSelect.value;
    }

    setGreetings([...greetings, { nickname, text }]);
    setCurrentPage(Math.floor(greetings.length / MESSAGES_PER_PAGE));
  }

  function prevPage() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    if ((currentPage + 1) * MESSAGES_PER_PAGE < greetings.length) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div>
      <div id="messageBox"></div>
      <p id="pageLabel"></p>
      <button id="prevButton" onClick={prevPage}>Previous</button>
      <button id="nextButton" onClick={nextPage}>Next</button>
      <form>
        <input id="nicknameInput" placeholder="닉네임" type="text" size="15"/>
        이(가)
        <div id="customGreetingDiv">
          <input id="greetingTextInput" type="text" name="greetingTextInput" 
                placeholder="인사"/>
          <input id="greetingEmojiInput" type="text" name="greetingEmojiInput" 
                placeholder="이모지" size="5" />
        </div>
        <select id="greetingSelect"></select>
        <button id="sendButton" type="button">올리기</button>
      </form>
    </div>
  );
}